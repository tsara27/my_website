---
slug: "yeay!-grouping-anagram-with-ruby"
title: Yeay! Grouping anagram with Ruby
date:   2015-5-2 7:55:57
categories: ruby
image: '009'
tags: blog ruby
description: It's been few months since I don't write any blog post. I have been really busy with some projects at the same time. That's why I leave my blog. Anyway, do you remember that I wrote a post about anagram few months ago? Now, I am going to share with you about grouping anagram words. It's going to be simple or not. It depends on how do you solve the problem. Let's start!
---
It's been few months since I don't write any blog post. I have been really busy with some projects at the same time. That's why I leave my blog. Anyway, do you remember that I wrote a post about anagram few months ago? Now, I am going to share with you about grouping anagram words. It's going to be simple or not. It depends on how do you solve the problem. Let's start! <!--more-->

Let's say that we have a variable called `words = ["ate", "eat", "tea", "keen", "meticulous", "spendid", "plug", "gulp"]` that contains words. We are going to organize the words with its anagram. For example, if I have this variable `x = ['bus', 'sub']` the result will be `'b', 's', 'u' => ['bus', 'sub']`. What do you think the solution would be?

Do you know that Ruby has group_by method? Find out more <a target="_blank" href="http://ruby-doc.org/core-2.2.2/Enumerable.html#method-i-group_by">here</a>. I will use group_by method here to organize the words.

Let's play with interactive ruby or `irb`. Run `irb` on your terminal. Put the variables with the array to your irb.

{% highlight ruby %}
irb> words = ["ate", "eat", "tea", "keen", "meticulous", "spendid", "plug", "gulp"]
irb> words.group_by { |word| word.split("").sort }
irb> {["a", "e", "t"]=>["ate", "eat", "tea"], ["e", "e", "k", "n"]=>["keen"], ["c", "e", "i", "l", "m", "o", "s", "t", "u", "u"]=>["meticulous"], ["d", "d", "e", "i", "n", "p", "s"]=>["spendid"], ["g", "l", "p", "u"]=>["plug", "gulp"]}
{% endhighlight %}

This is how it works. The words will be grouped by splitting the each words into characters, sort the splitted characters, then find words that have similar character. That simple.

There's another method that I will use here. It looks like more complex and longer. Let's create `anagram.rb` file and write this code.

{% highlight ruby %}
words = ["ate", "eat", "tea", "keen", "meticulous", "spendid", "plug", "gulp"]
h = Hash.new
keys = words.map {|word| word.split("").sort}.uniq
keys.each do |key|
  h[key] = []
  words.each do |word|
    if word.split("").sort == key
      h[key] << word
    end
  end
end

puts h
{% endhighlight %}

So here, I write hash variable called `h`. Before I start grouping the words into anagram characters, I should provide its anagram characters first. You can see on the line 3 that I split each words into sorted characters and remove duplicate anagram arrays from it by using `uniq` method. After the keys are provided, I start to do something with each anagram characters. I put each anagram characters as the key on hash that has empty array. Then, I do something with each words. Each words will be splitted and checked whether the splitted word has the same character with the anagram character. If the splitted word has the same character with the anagram character, the word will be pushed into the anagram character (hash key). So, when we run the `anagram.rb` with this `ruby anagram.rb`, the result would be like this.

{% highlight ruby %}
{["a", "e", "t"]=>["ate", "eat", "tea"], ["e", "e", "k", "n"]=>["keen"], ["c", "e", "i", "l", "m", "o", "s", "t", "u", "u"]=>["meticulous"], ["d", "d", "e", "i", "n", "p", "s"]=>["spendid"], ["g", "l", "p", "u"]=>["plug", "gulp"]}
{% endhighlight %}

That's  all from me! You can use your own solution. I would say that we should use the simplest solution in solving any problem that you face in coding.

Happy coding! :)
