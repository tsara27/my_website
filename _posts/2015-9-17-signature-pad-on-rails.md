---
layout: post
title: Signature Pad on Rails
date:   2015-9-17 8:12:55
categories: ruby
tags: blog rails ruby signature-pad signature
description: In developing world, we would see a lot of applications. Some applications might need a signature pad to sign an agreement or policies that they provide. How do we put the signature pad on Rails app? Now, I am going to explain how to put signature pad on Rails app. I will use jQuery plugin, SignaturePad, by Thomas J Bradley.
---

In developing world, we would see a lot of applications. Some applications might need a signature pad to sign an agreement or policies that they provide. How do we put the signature pad on Rails app? Now, I am going to explain how to put signature pad on Rails app. I will use jQuery plugin, SignaturePad, by Thomas J Bradley.<!--more-->

Here's the <a target="_blank" href="http://thomasjbradley.ca/lab/signature-pad">link</a> to the plugin. Download the plugin first, we will need `flashcanvas.js`, `jquery.signaturepad.min.js`, and `json2.min.js`. The stylesheets are included too on the plugin. We will need `jquery.signaturepad.css`, and `pen.cur` (cursor for signature).

Let's create a new rails application. Then, put the files in your `app/assets`, the js files on the `javascripts/signaturepad` and the css files with the pen cursor on the `stylesheets/signaturepad`. Don't forget to include those files in your application.

We can start the implementation right away. So, here, I am going to implement a simple agreement that needs to be signed. Let's start with the model first. Create a model named `Agreement` that has two columns, `name` with string type and `signature` with text type which will hold the coordinates from the signature later.

{% highlight ruby %}
rails g model Agreement name:string signature:text
{% endhighlight %}

We use `text`, because the coordinates would be very long. The `string` may not hold the whole coordinates. Don't forget to run the migration after you generate the model.

After the model is created and the table is made, we can move to the controller. Create a controller named `agreements_controller.rb`. Add `index`, `create`, and `show` methods on the controller.

{% highlight ruby %}
class AgreementsController < ApplicationController
  def index
    @agreement = Agreement.new
  end

  def create
    @agreement = Agreement.create(agreement_params)
    render action: "show" if @agreement.persisted?
  end

  def show
    @agreement = Agreement.find(params[:id])
  end

  private

  def agreement_params
    params.require(:agreement).permit(:name, :signature)
  end
end
{% endhighlight %}

In the create method, we could see that if `@agreement` is saved, so it would render `show` method. The show method will hold the agreement that has been created. Let's create the create the view for index page first. The page will contain a agreement and the signature pad.

{% highlight html %}
<!-- app/views/agreements/index.html.erb -->
<%= form_for @agreement, html: { class: "sigPad" } do |f| %>
  Your name: <%= f.text_field :name %><br />
  <h5>User Agreement</h5>
  <p>By signing this agreement, you promise to be a great person.</p>
  <div class="sig sigWrapper">
    <div class="typed"></div>
    <canvas class="pad" width="298" height="55"></canvas>
    <%= f.hidden_field :signature, class: "output" %><br />
  </div>
  <%= f.submit %>
<% end %>

<script type="text/javascript">
  $(document).ready(function () {
    $('.sigPad').signaturePad({ drawOnly:true });
  });
</script>
{% endhighlight %}

At the form we see that there's `sigPad` class on the form tag. The class will help us to initialize the signature pad. `sig` and `sigWrapper` class would be used for the signature pad box. Inside that class, there's a canvas and a hidden field. The canvas that would be the area of signature that can be drawn. The hidden field with class `output` will hold the coordinates for our signature.

As you can see at the bottom, there's javascript code to initiate the signature pad. I use `drawOnly` option, because we only need the drawing are for this time. We can use text field to generate our signature too. You can see the example <a target="_blank" href="https://thomasjbradley.github.io/signature-pad/examples/accept-signature.html">here</a>.

After the view is created, let's add the routes. Open the `config/routes.rb` and add this lines.

{% highlight ruby %}
root 'agreements#index'
resources :agreements
{% endhighlight %}

Run the server and go to the site. The page that we've created would look like this.

<iframe src="https://drive.google.com/file/d/0B245dSGaMJ5YbEhqUUNyNVFDa00/preview" style="width: 100%"></iframe>

Let's create a page to show the agreement that is created.

{% highlight html %}
<!-- app/views/agreements/show.html.erb -->
<h3>Hello <%= @agreement.name %></h3>
<p>Thank you for signing the agreement. You have promised to be a great person!</p>
<div class="sigPad sigWrapper">
  <div class="typed"></div>
  <canvas class="pad" width="298" height="55"></canvas>
  <input type="hidden" name="output" class="output"/>
</div>

<script type="text/javascript">
  $(document).ready(function () {
    sig = <%= raw @agreement.signature %>;
    $('.sigPad').signaturePad({ displayOnly:true }).regenerate(sig);
  });
</script>
{% endhighlight %}

You can see that I add `sig` variable on the js code. The variable contains the `@agreement.signature` value as text. Then, by using `raw`, I make the value into JSON data.

When I initiate the signature, I use option `displayOnly: true` to make the signature pad not drawable. Then, `regenerate(sig)` is used for generating a signature that is created and kept in `sig` variable.

Try to add your signature, you'll see the result just like this.

<iframe src="https://drive.google.com/file/d/0B245dSGaMJ5YdjFlcHQ5Y2dOYWM/preview" style="width: 100%"></iframe>

You can access the app repository <a target="_blank" href="https://github.com/tsara27/sample_signature_pad">here</a>.

Thank you for following this tutorial. Keep learning and happy coding!
