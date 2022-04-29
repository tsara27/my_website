---
slug: "git-squashing-your-commits.-make-your-commits-into-a-commit!"
title: Git - Squashing Your Commits. Make your commits into a commit!
date:   2015-12-25 13:45:47
categories: git
image: '007'
tags: blog git squash rebase commits commit
description: In this article, I am going to tell you about squashing your commits with git. Squashing your commits would be useful for developing your application when you should use one commit message in describing the whole changes. Usually, you would use it when you work on a team, and you send the changes to be reviewed by other developers.
---

In this article, I am going to tell you about squashing your commits with git. Squashing your commits would be useful for developing your application when you should use one commit message in describing the whole changes.<!--more-->

Usually, you would use it when you work on a team, and you send the changes to be reviewed by other developers. Can you imagine if you have 20 commits describing the feature that you made? I think it would take time to click every commit, checking the code on the commit, give the review to you, then do the same thing again until the last commit.

Let's dive into the implementation.

First thing todo is that you have to make sure that you're in correct branch. Then, let's see the commits that you want to be squeashed use `git log` on your terminal.

You'll see something like,

{% highlight text %}
commit 6cdd995e17adc3f37b119ded1ed8e6310a46ecb6
Author: fkeusr <faksr@example.com>
Date:   Thu May 21 17:20:06 2015 +0700

    add destroy all on todos

commit 53604564f4d8ef38ff91ae9baa0bd7140fdb7ac3
Author: fkeusr <faksr@example.com>
Date:   Thu May 21 17:19:45 2015 +0700

    add materialize toast

commit d0ddf3de0ec8e6808734e40e5ccad72750745661
Author: fkeusr <faksr@example.com>
Date:   Thu May 21 17:19:15 2015 +0700

    add clear all

commit cac87d20fb3f1feb02ff02e8e08b67bdd0768e48
Author: fkeusr <faksr@example.com>
Date:   Thu May 21 16:49:06 2015 +0700

    add destroy all method

commit fder8091823asdsaaw12312q321sae2132123212
Author: demouser <demo@fake.com>
Date:   Thu May 21 16:48:36 2015 +0700

    add override

commit e1a7985400eaa4cfe9c2f9726f52eeecfbae1033
Author: demouser <demo@fake.com>
Date:   Wed May 19 07:48:36 2015 +0700

    add new feature
{% endhighlight %}

Let's say the `fkeusr` is you. You can see that there are **4 commits** that you've made and you want to squash the commits into one commit. Let's squashing the commits now. Use this command to run interactive rebase from your terminal.

{% highlight text %}
git rebase -i HEAD~n
{% endhighlight %}

Change `n` into number of commits from the last commit, `4` commits, that you want to squashed.  After you hit enter, you'll see something like this.

{% highlight text %}
pick 6cdd995 add destroy all on todos
pick 5360456 add materialize toast
pick d0ddf3d add clear all
pick cac87d2 add destroy all method

# Rebase cac87d2..39c606a onto cac87d2 (4 command(s))
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
{% endhighlight %}


As you can see that there are last 4 commits that you want to rebase. Change 3 commits from the bottom into `squash` or `s` rather than `pick`. So, the 3 commits on the bottom will be squashed into the last commit that is still left with `pick` command on the top. Just like this.


{% highlight text %}
pick 6cdd995 add destroy all on todos
s 5360456 add materialize toast
s d0ddf3d add clear all
s cac87d2 add destroy all method

# Rebase cac87d2..39c606a onto cac87d2 (4 command(s))
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
{% endhighlight %}

After that, you can save the changes and you'll see something like,

{% highlight text %}
# This is a combination of 4 commits.
# The first commit's message is:
add destroy all on todos

# This is the 2nd commit message:

add materialize toast

# This is the 3rd commit message:

add destroy all method

# This is the 4th commit message:

update
# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Thu May 21 17:19:15 2015 +0700
#
# rebase in progress; onto cac87d2
# You are currently editing a commit while rebasing branch 'master' on 'cac87d2'.
#
# Changes to be committed:
#       modified:   Gemfile.lock
#       modified:   app/assets/javascripts/functions.js
#       modified:   app/assets/stylesheets/application.scss
#       new file:   app/assets/stylesheets/override.scss
#       new file:   app/assets/stylesheets/styles.scss
#       modified:   app/controllers/api/todos_controller.rb
#       modified:   app/views/home/_doing.slim
#       modified:   app/views/home/_done.slim
#       modified:   app/views/home/_listed.slim
#       modified:   app/views/home/_todos_row.slim
#       modified:   app/views/home/index.slim
#       modified:   config/routes.rb
#
{% endhighlight %}

You can remove these lines, and change the commit message into your commit summary and save the changes.

{% highlight text %}
# This is a combination of 4 commits.
# The first commit's message is:
add destroy all on todos

# This is the 2nd commit message:

add materialize toast

# This is the 3rd commit message:

add destroy all method

# This is the 4th commit message:

update
{% endhighlight %}

You can check again your log using `git log`, and you'll see that your commits squashed.

{% highlight text %}
commit 37366d3e3959ee30afa88206c84df37e6efdbe92
Author: fkeusr <faksr@example.com>
Date:   Thu May 21 17:20:06 2015 +0700

    this is my commits summary

commit fder8091823asdsaaw12312q321sae2132123212
Author: demouser <demo@fake.com>
Date:   Thu May 21 16:48:36 2015 +0700

    add override

commit e1a7985400eaa4cfe9c2f9726f52eeecfbae1033
Author: demouser <demo@fake.com>
Date:   Wed May 19 07:48:36 2015 +0700

    add new feature
{% endhighlight %}

Thank you for following this tutorial. See you on next tutorial. :)
