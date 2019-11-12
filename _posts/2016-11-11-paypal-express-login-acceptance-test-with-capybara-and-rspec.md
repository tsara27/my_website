---
layout: post
title: Paypal Login — Acceptance Test with Capybara and RSpec
date:   2016-11-11 19:00
categories: ruby
image: '006'
tags: blog rails ruby capybara paypal
description: I was working on acceptance test for paypal login recently. It was hard on the beginning, because I found that the login form was put inside an iframe. Using plain capybara finder when locating the input text for email and password was painful. That wasn't working. I should use capybara method `within_iframe` to make it works.
---

I was working on acceptance test for paypal login recently. It was hard on the beginning, because I found that the login form was put inside an iframe. Using plain capybara finder when locating the input text for email and password was painful. That wasn't working. I should use capybara method `within_frame` to make it works.<!--more-->

{% highlight ruby %}
within_frame find("iframe") do
  wait_until(60) { page.has_css? "#email" }
  fill_in "email", with: "sample@mail.com"
  fill_in "password", with: "passwordsample"
  click_button "Log In"
end
{% endhighlight %}

You see that I use `wait_until` above. I use that to verify that the email input is loaded on the page or the input cannot be filled in.

I will share more from what I have learned from web development. See you next time.
