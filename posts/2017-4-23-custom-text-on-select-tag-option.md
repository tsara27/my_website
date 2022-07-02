---
slug: "custom-text-on-select-tag-option"
title: Custom Text on Select Tag Option
date:   2017-4-23 11:40
categories: ruby
image: '005'
tags: blog rails ruby
description: There's some cases when we need to customize how we display the text on option inside select tag. We can customize that in very simple way. We only need to create a custom instance method on the model that we use on the select tag. Let's jump into the code.
---

There's some cases when we need to customize how we display the text on option inside select tag. We can customize that in very simple way. We only need to create a custom instance method on the model that we use on the select tag. Let's jump into the code.<!--more-->

For example, you have this code inside your view.

{% highlight ruby %}
  <%= select_tag 'people', options_from_collection_for_select(Person.all, 'id', 'first_name') %>
{% endhighlight %}

Populating the options that relies the text on `first_name` of the person will be confusing. Some of people might have same first name. The best thing that we can do is using their full name to the options that are displayed on the select tag. I have mentioned that we can add additional custom instance method inside `Person` class.

{% highlight ruby %}
  class Person < ApplicationRecord
    def name
      "#{first_name} #{last_name}"
    end
  end
{% endhighlight %}

Then, change the `first_name` on select tag into `name`. Here's the code.

{% highlight ruby %}
  <%= select_tag 'people', options_from_collection_for_select(Person.all, 'id', 'name') %>
{% endhighlight %}

Try to refresh the page and you'll see that the option text will be person full name.

This approach will work on `f.collection_select` too. Hope that helps. :)
