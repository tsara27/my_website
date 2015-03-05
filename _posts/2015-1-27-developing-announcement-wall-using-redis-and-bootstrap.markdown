---
layout: post
title: Developing Announcement Wall Using Redis and Bootstrap
date:   2015-1-19 19:42:32
categories: rails
tags: blog ruby rails redis
description: There will be a moment where using RDBMS is not really recommended when the process itself has fast pace in storing and destroying a record on database. For example in announcement application a user will create announcement that would be available in 30 minutes, post an information and it's disappeared after the time is up. In this case, we can use a key value store, or referred to NoSQL database.
---
There will be a moment where using RDBMS is not really recommended when the process itself has fast pace in storing and destroying a record on database. For example in announcement application a user will create announcement that would be available in 30 minutes, post an information and it's disappeared after the time is up. In this case, we can use a key value store, or referred to NoSQL database.<!--more-->

There are some NoSQL database such as <a href="http://www.mongodb.org/">MongoDB</a>, <a href="http://redis.io/Redis">Redis</a>, etc. Each of them has different characteristics and implementation. You can read the documentation for more details.

Now, we will implement a really simple announcement application using Redis hash key and expire, also bootstrap sass to make the page looks better. Let's get started.

## Preparing Redis and Bootstrap

Generate new rails application using `rails new simple_announcement`. Remove turbolinks from the app, we will not need turbolinks this time. Then, add redis gem inside the Gemfile. Run `bundle install`. If you see in redis gem documentation, we can initiate redis by using `redis = Redis.new` everytime we need it. Because we are going to use it all over the time we use application, it would be better if we create redis initializer. Let's create `redis.rb` inside `config/initializers/` folder. Write this into it.

{% highlight Ruby %}
$redis = Redis.new
{% endhighlight %}

Let's add bootstrap into our application. Add this into our `Gemfile` and run `bundle install`.

{% highlight Ruby %}
gem 'sass-rails', '~> 5.0'
gem 'bootstrap-sass', '~> 3.3.3'
{% endhighlight %}

Insert this line after `jquery_ujs` on `app/assets/javascripts/application.js`.

{% highlight Javascript %}
//= require bootstrap-sprockets
{% endhighlight %}

Rename `app/assets/stylesheets/application.css` into `application.scss`, empty the file and put the lines below inside the file.


{% highlight CSS %}
@import "bootstrap-sprockets";
@import "bootstrap";
body > .container{
  padding-top: 60px;
}
{% endhighlight %}

## Create Announcement Model

We know that Ruby on Rails will use ActiveRecord that handles the model. Because Redis doesn't support ActiveRecord, let's create a class named Announcement inside application model.

{% highlight Ruby %}
class Announcement
end
{% endhighlight %}

Things that we need to do after creating the class is adding methods that supports app functionality. In this case, announcement needs two methods. The first one is `add` value to key and the last one is `fetch` all keys. Here's the implementation.

{% highlight Ruby %}
class Announcement
  def add(announcement, posted_by, expire)
    timestamp = Time.now.to_i
    $redis.hmset("announcement:#{timestamp}", "announcement", announcement, "posted_by", posted_by)
    $redis.expire("announcement:#{timestamp}", expire)
  end

  def fetch_all
    arr = []
    announcements = $redis.keys("announcement:*")
    announcements.each { |announcement| arr << $redis.hgetall(announcement) }
    return arr
  end
end
{% endhighlight %}

In the `add` method we pass three parameters, such as announcement text, who post the announcement, and when the announcement is expired. We know that there might be some users that post announcement at the same time, so the hash key for announcement should be unique. In this case, I would use timestamp to differentiate the keys. The first argument that passed to the hmset method is the name of the hash key. The second is the key inside the hash to store specified value followed by the value of the key and so on. Then, after the hash key is created, we set how many seconds that the hash key will be expired because we know that announcement won't be last forever.

Let's see on `fetch_all` method that we initiate empty array. The empty array will be filled by hash keys that begin with announcement. After the announcements are fetched, we put all the hashes into the empty array. The array will be filled by hashes and returned.

> Don't forget to run `redis-server` before you run `rails server`.

## Create Announcement Controller and Views

In this section we are going to create application layout, app functionality and its interface.

### Create Application Layout

Let's open `app/views/layouts/application.html.erb`. Change the layout into this. We will render navigation bar that is separated from this file.

{% highlight HTML %}
<!DOCTYPE html>
<html>
  <head>
    <title>Announcement Wall</title>
    <%= stylesheet_link_tag    'application', media: 'all' %>
    <%= javascript_include_tag 'application' %>
    <%= csrf_meta_tags %>
  </head>
  <body>
    <%= render "layouts/navbar" %>
    <!-- Begin page content -->
    <div class="container">
      <%= yield %>
    </div>
  </body>
</html>

{% endhighlight %}


{% highlight HTML %}
<!-- app/views/layouts/_navbar.html.erb -->
<!-- Fixed navbar -->
<nav class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="/">Announcement Wall</a>
    </div>
    <div id="navbar" class="collapse navbar-collapse">
      <ul class="nav navbar-nav">
        <li class="active"><%= link_to "Post Announcement!", new_announcement_path%></li>
      </ul>
    </div><!--/.nav-collapse -->
  </div>
</nav>
{% endhighlight %}

You can refresh the page. Then, you'll see.
<iframe src="https://docs.google.com/file/d/0B245dSGaMJ5YUDY2cDdoZnhqeFU/preview" style="width: 100%"></iframe>

### Create Application Functionality and Interface

The model and layout are setup. Then, we need to implement announcement interface to help user to create and view announcements from web page. Let's create the announcements controller.

{% highlight Ruby %}
class AnnouncementsController < ApplicationController
  before_action :init_class

  def index
    @announcements = @announcement.fetch_all
  end

  def create
    @announcement.add(params[:text], params[:posted_by], params[:expire])
    redirect_to announcements_path
  end

  private

  def init_class
    @announcement = Announcement.new
  end
end

{% endhighlight %}

We use "plain" class to define our Announcement model. So, we have to initiate the class at the first time using before action filter. As you can see inside the index method, I put an instance variable named `@announcements`. It is used to fetch announcements on Redis storage. The announcements that are fetched from Redis are compiled as JSON data type. So, while we put it on the view, it has different ways from generating query result from `ActiveRecord`.

Let's create `app/views/announcements/index.html.erb`.

{% highlight Ruby %}
<% @announcements.each do |announcement|%>
  <div class="well">
    <blockquote>
      <%= announcement['announcement'] %>
    </blockquote>
    <p>
      - <%= announcement['posted_by'] %>
    </p>
  </div>
<% end %>
{% endhighlight %}

After that, add announcements routes `resources :announcements, only: [:index, :new, :create]`. Don't forget to set root path into `anouncements#index`. Then, go to `http://localhost:3000/announcements`. You'll see an empty container there. Because there's no hash keys that stored on Redis storage.

Next step, we can add announcement form. We can just add `new.html.erb` inside `app/views/announcements` without creating method. When we create the routes, Rails will automatically searching for the view when there's no method related with the routes. Let's fill `new.html.erb` with this.

{% highlight HTML %}
<div class="row">
  <div class="col-md-11 well">
  <h3>Post Announcement</h3>
  <%= form_tag announcements_path, method: :post, class: "form-horizontal" do %>
    <div class="form-group">
      <%= label_tag 'text', "Announcement Text", class: 'col-sm-2 control-label' %>
      <div class="col-sm-10">
        <%= text_field_tag 'text', "", class: "form-control" %>
      </div>
    </div>
    <div class="form-group">
      <%= label_tag 'posted_by', "Posted By", class: 'col-sm-2 control-label' %>
      <div class="col-sm-10">
        <%= text_field_tag 'posted_by', "", class: "form-control" %>
      </div>
    </div>
    <div class="form-group">
      <%= label_tag 'expire', "Expired on (seconds)", class: 'col-sm-2 control-label' %>
      <div class="col-sm-10">
        <%= select_tag "expire", options_for_select([ 10, 20, 30, 60], 30) %>
      </div>
    </div>
    <div class="form-group">
    <div class="col-sm-offset-2 col-sm-10">
      <%= button_tag "Submit", class: "btn btn-default" %>
    </div>
  </div>
  <% end %>
  </div>
</div>
{% endhighlight  %}

Let's try to post announcement.

<iframe src="https://docs.google.com/file/d/0B245dSGaMJ5YUUR6Tm1NMkRuVWc/preview" style="width: 100%"></iframe>

We've created method `create` on the controller.

{% highlight Ruby %}
class AnnouncementsController < ApplicationController
  ...
  def create
    @announcement.add(params[:text], params[:posted_by], params[:expire])
    redirect_to announcements_path
  end
  ...
end

{% endhighlight %}

We can use method add from Announcement model and pass arguments into it. After it is created, we can see that the announcement is already posted on the website. Voila!

<iframe src="https://docs.google.com/file/d/0B245dSGaMJ5YTVV2NTFMcEx4c3M/preview" style="width: 100%"></iframe>

You can see the source <a href="https://github.com/tsara27/announcement_wall">here</a>. 
