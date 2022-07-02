---
slug: mysql-gem-and-mamp
title: MySQL Gem and MAMP
date: 2018-1-25 11:40
categories: ruby
image: '003'
tags: blog rails ruby mysql mamp
description: Working with Ruby code a lot, that’s what I do for almost 4 years. But, when I should add mysql gem to my machine. There’s always a problem. It could not be installed because the gem installation expects the mysql installed on default path. I need to include mysql config that is placed within MAMP application.
---

I usually use MAMP to add mysql to my local machine. I am using MAMP because I can use phpmyadmin to see my databases. I love simple things, that’s why I use it straight ahead.

Working with Ruby code a lot, that’s what I do for almost 4 years. But, when I should add mysql gem to my machine. There’s always a problem. It could not be installed because the gem installation expects the mysql installed on default path. I need to include mysql config that is placed within MAMP application. Here’s what I did.

{% highlight bash %}
gem install mysql2 -- --with-mysql-config=/Applications/MAMP/Library/bin/mysql_config
{% endhighlight %}

I added `with-mysql-config` when installing the gem. Mysql gem will be installed successfully. I don’t need to add mysql separately on my machine to make it work.
