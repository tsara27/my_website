---
slug: "create-simple-messaging-application-using-ajax-and-ancestry"
title: Create Simple Messaging Application Using Ajax and Ancestry
date:   2015-1-16 06:02:00
categories: rails
image: '012'
tags: blog ruby rails ajax
description: In some cases in developing application I met requirement that I should create messaging, comment, or forum feature. I want to share about how to implement a simple messaging app. Basically the flow is more or less just like this, somebody send a message and somebody else reply it. That's simple. But, how is the code looks like.
---
Before start reading this tutorial I recommend you to have basic knowledge of Ruby, Ruby on Rails, and jQuery.

In some cases in developing application I met requirement that I should create messaging, comment, or forum feature. I want to share about how to implement a simple messaging app. Basically the flow is more or less just like this, somebody send a message and somebody else reply it. That's simple. But, how the code looks like.<!--more-->

First thing first, as usual, generate a rails app using `rails new simple_messaging` inside the terminal. Don't forget to point the folder where do you want to put the app. After that let's run `rake db:create` to create the database. We're going to create a table that stores messages. So it should have several fields such as name. message, and timestamps. That simple. Let's create the Message model use rails generator `rails g model message`. Open the `message.rb` in app/models. Add name, message, and timestamps fields to the migration.

> If you find a problem in migration or creating database with Ralis 4.2 you may add `gem 'arel', '6.0.0.beta2'` to your Gemfile and do `bundle install`
> In rails 4.2 you have to add `gem 'responders'` to implement xhr request

{% highlight ruby %}
class CreateMessages < ActiveRecord::Migration
  def change
    create_table :messages do |t|
      t.string :name
      t.string :text
      t.timestamps
    end
  end
end
{% endhighlight %}

Run `rake db:migrate` to run the migration above.

Then create a controller named `messages_controller.rb`.  Add `@messages` variable to load whole messages for each methods using `before_action` and `@message` variable for initializing new message.

{% highlight ruby %}
class MessagesController < ApplicationController
  before_action :load_messages
  before_action :new_message

  private

  def load_messages
    @messages ||= Message.all
  end

  def new_message
    @message ||= Message.new
  end
end
{% endhighlight %}

Create `index.html.erb` inside `app/views/messages/` and put this code inside. We will make the form and the list into one page.

Before we create the index page. We can remove turbolinks gem from Gemfile and execute `bundle install` from terminal. After that, remove the turbolinks from layout and javascript. Then, you may create the index page and put this code into it.

{% highlight html %}
<div class="messages-list"><%= render "list" %></div>
<h3>Add New Message</h3>
<div class="messages-form"><%= render "form" %></div>
{% endhighlight %}

We will use form partials to help us implement ajax within the page. Create this partial views within messages.

{% highlight html %}
<!-- app/views/messages/_list.html.erb -->
<h3>This site has <%= "#{@messages.count} #{@messages.count > 1 ? 'message'.pluralize : 'message'}." %></h3>
<% @messages.each do |message| %>
  <p><%= message.name %></p>
  <p><%= message.text %></p>
  <hr>
<% end %>
{% endhighlight %}

{% highlight html %}
<!-- app/views/messages/_form.html.erb -->
<%= form_for @message, remote: true do |m| %>
  <%= m.text_field :name, placeholder: "Name" %>
  <br>
  <br>
  <%= m.text_area :text, placeholder: "Your message here" %>
  <br>
  <%= m.submit "Send" %>
<% end %>
{% endhighlight %}


Don't forget to add messages controller to routes. Add `resource :messages` inside the routes and uncomment the default root and change the root into `root 'messages#index'`. Run `rails s -p 7777` and open `http://localhost:7777/` in your browser.

<iframe src="https://docs.google.com/file/d/0B245dSGaMJ5YSFRMTEFPbjFkUXc/preview" style="width: 100%"></iframe>

You'll see the page above. The `@messages = Message.all` will load all messages that is kept on the database. `@messages.count` will count how many messages existed on the database. We still have zero message. Let's build a new method to create new message using ajax. Rails has great environment to handle this. Would be very simple! Don't be scared!

Let's add create action on the controller and message parameters on private scope.

> You don't have to add routes for that because `resource :messages` represents RESTful controller (index, new, create, edit, update, destroy).

{% highlight ruby %}
class MessagesController < ApplicationController
  ...
  def create
    @message = Message.new(message_params)
    @message.save
  end

  private

  ...

  def message_params
    params.require(:message).permit(:name, :text)
  end
end
{% endhighlight %}

Put this code below into `create.js.erb` inside `app/views/messages/`.

{% highlight javascript %}
<% if @message.persisted? %>
  $(".messages-list").html('<%=j render "list" %>')
<% end %>
{% endhighlight %}

Modify `application_controller.rb` with this. This will set `layout 'false'` when the form is submitted using ajax.

{% highlight ruby %}
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  layout :is_xhr?

  def is_xhr?
    false if request.xhr?
  end
end
{% endhighlight %}

The `message_params` represent parameters that are generated from the form using `form_for` tag. After the create action is running, rails will search for the response. Because we use ajax in submitting the form, so we set the response using javascript extension to update the list without reloading the page. We should set the layout into false, or the page will appear once again.

Create your first message. When you click `Send` button, the list will be updated without reloading the page.

<iframe src="https://docs.google.com/file/d/0B245dSGaMJ5YSkFBVlJTWU10QjQ/preview" style="width: 100%"></iframe>

Let's create the system for replying messages. Add `gem 'ancestry'` in your Gemfile and run `bundle install` from your terminal. Then, generate migration on terminal `rails g migration add_ancestry_to_messages ancestry:string`. Open the migration file on `db/migrate` and put this code into it.

{% highlight ruby %}
def up
  add_column :messages, :ancestry, :string
  add_index :messages, :ancestry
end

def down
  remove_column :messages, :ancestry, :string
  remove_index :messages, :ancestry
end
{% endhighlight %}

Migrate it and add this line, `has_ancestry`, to your `Message` model on `message.rb`. Then, create the `reply` action to call reply form.

Add this one to `messages_controller.rb`.

{% highlight ruby %}
def reply
  @parent = Message.find(params[:id])
end
{% endhighlight %}

`@parent` refers to the message id that is going to be replied. Add the routes `get :reply, on: :member` under `resources :messages`. Just like this.

{% highlight ruby %}
resources :messages do
  get :reply, on: :member
end
{% endhighlight %}

Run `rake routes` and you'll have `reply_message GET    /messages/:id/reply(.:format)      messages#reply`. You can see that there is a `params[:id]` on the path. That refers to message id that is going to be replied. Let's give the link on the list that refers to reply form.

{% highlight html %}
<!-- app/views/messages/_list.html.erb -->
....
  <p><%= message.name %></p>
  <p><%= message.text %></p>
  <p><%= link_to "Reply", reply_message_path(message) %></p>
  <hr>
<% end %>
{% endhighlight %}

Prepare the view for `reply` action which render the same partial form `_form.html.erb`.

{% highlight html %}
<!-- app/views/messages/reply.html.erb -->
<div class="message">
  <p><%= @parent.name %></p>
  <p><%= @parent.text %></p>
</div>
<h3>Reply Message</h3>
<div class="messages-form"><%= render "form" %></div>
{% endhighlight %}

Click reply link on the first message. Then, you'll have this view. Try to submit a message and the form is not going to work.

<iframe src="https://docs.google.com/file/d/0B245dSGaMJ5Yd2NQcWNxcXdSLTA/preview" style="width: 100%"></iframe>

After that, let's create `send_reply` action to handle the post request to reply the message. Add the action to the routes.

{% highlight ruby %}
def send_reply
  @reply_message = Message.find(params[:id]).children.create message_params
  redirect_to root_path if @reply_message.persisted?
end
{% endhighlight %}

{% highlight ruby %}
# config/routes.rb
resources :messages do
  get :reply, on: :member
  post :send_reply, on: :member

  # or

  member do
    get :reply
    post :send_reply
  end
end
{% endhighlight %}


We use `children` method, scopes the model on children of the record, to create new child record (the reply message). Then, we should add this action to the form. Let's change the `action` and `data-remote` on the form attributes. Don't forget to modify the list, so it display the root message in reply message.

{% highlight html %}
<!-- app/views/messages/_form.html.erb -->
<%= form_for @message, url: (send_reply_message_path(id: @parent.id) if params[:action] == "reply"), remote: (true if params[:action] == "index") do |m| %>
  <%= m.text_field :name, placeholder: "Name" %>
  <br>
  <br>
  <%= m.text_area :text, placeholder: "Your message here" %>
  <br>
  <%= m.submit "Send" %>
<% end %>
{% endhighlight %}

{% highlight html %}
<!-- app/views/messages/_list.html.erb -->
<h3>This site has <%= "#{@messages.count} #{@messages.count > 1 ? 'message'.pluralize : 'message'}." %></h3>
<% @messages.each do |message| %>
  <blockquote>
    <p><%= message.parent.try(:name) %></p>
    <p><%= message.parent.try(:text) %></p>
  </blockquote>
  <p><%= message.name %></p>
  <p><%= message.text %></p>
  <p><%= link_to "Reply", reply_message_path(message) %></p>
  <hr>
<% end %>
{% endhighlight %}

Try to reply a message after you modified the form. You'll see that the form is working! just like this.

<iframe src="https://docs.google.com/file/d/0B245dSGaMJ5YcVhVbC1TaXZvZEU/preview" style="width: 100%"></iframe>

If you want to see complete methods on `ancestry` you can visit this <a href="https://github.com/stefankroes/ancestry" target="_blank">link</a>. For this tutorial source code, you can visit this <a href="https://github.com/tsara27/simple_messaging" target="_blank">link</a>.

Thanks for reading! Happy Coding!
