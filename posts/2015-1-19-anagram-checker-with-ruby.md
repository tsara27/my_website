---
slug: anagram-checker-with-ruby
title: Anagram Checker with Ruby
date:   2015-1-19 19:42:32
categories: ruby
image: '011'
tags: blog ruby
description: Few days ago I had a test to check whether a word is anagram or not. Now, I want to share with you how to check anagram using Ruby. Let's say that we have two words, and want to check if the both of them is anagram. What I am going to do is that split each words and make sure that the words have same characters and length.
---
Few days ago I had a test to check whether a word is anagram or not. Now, I want to share with you how to check anagram using Ruby. Let's say that we have two words, and want to check if the both of them is anagram. What I am going to do is that split each words and make sure that the words have same characters and length.<!--more-->

Let's implement the logic here. Create file named `anagram.rb`.

{% highlight ruby %}
def is_anagram?(first_word, second_word)
  (first_word.chars - second_word.chars).length.zero? ? "Is anagram!" : "Not anagram!"
end

puts is_anagram?("less", "sell")
puts is_anagram?("lose", "sell")
{% endhighlight %}

So, what I did first is splitting each words, then subtract the first word with the second word. Let see the first case where the first word is "less" and the second word is "sell". "less" will be splitted into `["l", "e", "s", "s"]` and the word "sell" into `["s", "e", "l", "l"]`. When the first array is subtracted with the second array, this will raise `[]`, which has zero length. If the words are the set of anagram, so the length will be zero and vise versa.

Run the script using `ruby anagram.rb` in your terminal. Then it would return,
{% highlight ruby %}
Is anagram!
Not anagram!
{% endhighlight %}

Happy coding! :)
