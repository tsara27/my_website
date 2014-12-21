---
layout: post
title:  "How to Get Particular Objects in Array?"
date:   2014-12-21 11:02:46
categories: ruby
tags: blog ruby object array 
description: Finding particular rows from a table from relational database is commonly used by many developers in developing their application. But, how to find particular objects in array. In my opinion, finding rows from a table on relational database is easier than find particular objects from array which too logical sometimes (haha). I just have to create the query that select particular rows or using active record to fetch the rows.
---
Finding particular rows from a table from relational database is commonly used by many developers in developing their application. But, how to find particular objects in array. In my opinion, finding rows from a table on relational database is easier than find particular objects from array which too logical sometimes (haha). I just have to create the query that select particular rows or using active record to fetch the rows. <!--more-->

Why do I share this? Because for the first time I had a test for Rails job recently that forced me to use this method. Let's see how is the method works.

{% highlight JavaScript %}
//Let's say that I have cupcakes variables
cupcakes = [{
  "name" => "Classic Vanilla",
  "taste" => ["sweet", "vanilla"],
  "orders" => { "min" => 1, "max" => 20},
  "price" => 5.4
},
{
  "name" => "Classic Vanilla Chocolate",
  "taste" => ["really sweet", "vanilla", "chocolate"],
  "orders" => { "min" => 1, "max" => 1},
  "price" => 5.8
},
{
  "name" => "Ghirardelli Square",
  "taste" => ["sweet", "chocolate"],
  "orders" => { "min" => 1, "max" => 10},
  "price" => 5.5
},
{
  "name" => "Durian Square",
  "taste" => ["little bit salty", "sweet", "fantastic"],
  "orders" => { "min" => 5, "max" => 5},
  "price" => 7
},
{
  "name" => "Rambutan Unique",
  "taste" => ["sweet", "fantastic", "awesome"],
  "orders" => { "min" => 5, "max" => 5},
  "price" => 10
}]
{% endhighlight %}

I want to select cupcakes that match this following criteria,

1. Cupcake with the most expensive and most bargain price.
2. Cupcakes that have taste of sweet and chocolate.
3. Cupcake that can be ordered with with specific value (eg. minimum order is 5 and the maximum is equal to the minimum order)

These are the answers.
<ol>
<li> I use <a href="http://apidock.com/ruby/Enumerable/minmax_by" target="_blank">minmax_by</a> method. You'll see that this method will take least value of price and the highest value of the price. The method will identified each objects as <code>x</code> and take the price objects from each root objects.</li>

{% highlight JavaScript %}
    cupcakes.minmax_by {|x| x['price']}
    => [{"name" => "Classic Vanilla",
      "taste" => ["sweet", "vanilla"],
      "orders" => { "min" => 1, "max" => 20},
      "price" => 5.4
    },
    {
      "name" => "Rambutan Unique",
      "taste" => ["sweet", "fantastic", "awesome"],
      "orders" => { "min" => 5, "max" => 5},
      "price" => 10 }]
{% endhighlight %}

<li>There are two ways in solve this problem but each has different result. The first one is to get cupcakes that have sweet taste and chocolate taste. The second one is to find cupcakes that contain sweet and chocolate (whatever the taste is eg. really sweet, slightly sweet, black chocolate, etc)</li>

Here is the first code. I use <a href="http://www.ruby-doc.org/core-2.1.5/Array.html#method-i-select" target="_blank">select</a> and <a href="http://www.ruby-doc.org/core-2.1.5/Array.html#method-i-include-3F" target="_blank">include?</a> method.

{% highlight JavaScript %}
cupcakes.select { |x| x['taste'].include?('sweet') && x['taste'].include?("chocolate") }
=> [{"name"=>"Ghirardelli Square", 
"taste"=>["sweet", "chocolate"], 
"orders"=>{"min"=>1, "max"=>10}, 
"price"=>5.5}] 
{% endhighlight %}

The second method is using <a href="http://ruby-doc.org/core-2.1.5/Enumerable.html#method-i-any-3F">any?</a> (enumerable) and <a href="http://www.ruby-doc.org/core-2.1.5/Array.html#method-i-select" target="_blank">select</a>.

{% highlight JavaScript %}
cupcakes.select { |x| x['taste'].any? { |w| w.include?("sweet")} && 
x['taste'].any? { |w| w.include?("chocolate") }}
=> [{"name"=>"Classic Vanilla Chocolate", 
"taste"=>["really sweet", "vanilla", "chocolate"], 
"orders"=>{"min"=>1, "max"=>1}, 
"price"=>5.8}, 
{"name"=>"Ghirardelli Square", 
"taste"=>["sweet", "chocolate"], 
"orders"=>{"min"=>1, "max"=>10},
"price"=>5.5}] 
{% endhighlight %}

<li>To solve this problem I just need to use <a href="http://www.ruby-doc.org/core-2.1.5/Array.html#method-i-select" target="_blank">select</a> and a comparison operator <code>==</code>. Here's the code.</li>
{% highlight JavaScript %}
cupcakes.select { |x| x['orders']['min'] == x['orders']['max'] }
=> [{"name"=>"Classic Vanilla Chocolate", 
"taste"=>["really sweet", "vanilla", "chocolate"], 
"orders"=>{"min"=>1, "max"=>1}, 
"price"=>5.8}, 
{"name"=>"Durian Square", 
"taste"=>["little bit salty", "sweet", "fantastic"], 
"orders"=>{"min"=>5, "max"=>5}, "price"=>7}, 
{"name"=>"Rambutan Unique", 
"taste"=>["sweet", "fantastic", "awesome"], 
"orders"=>{"min"=>5, "max"=>5}, 
"price"=>10}] 
{% endhighlight %}
</ol>

That's all from me. Thanks for reading! Happy coding!

