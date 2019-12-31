---
layout: post
title: Adding Custom Rake Task Using Capistrano
date: 2019-12-31 14:43
categories: ruby
image: '015'
tags: blog ruby rails capistrano
description: When I am using Capistrano to deploy Rails application, there will be a case where I need to change data on production. I usually do that by creating a rake task that will run series of commands that will help me update the data.
---

When I am using Capistrano to deploy Rails application, there will be a case where I need to change data on production. I usually do that by creating a rake task that will run series of commands that will help me update the data.

It will be easier if I can update that through my local CLI instead of login to the server, go to the project folder, and run the command from there.

These are few steps that I follow to achieve it.

#### 1. Make sure the rake task that you want to run is ready on the production server.

You have to deploy the rake task that you want to run from your local CLI before creating the capistrano task that runs
rake task.

#### 2. Create a Capistrano task that is used to run rake from the CLI.

I am using Capistrano version **3.10**. If I see `Capfile` after I setup capistrano,
I'll see that there is a line that defines Capistrano loads custom task from `lib/capistrano/tasks/` folder.

{% highlight ruby %}
# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob("lib/capistrano/tasks/*.rake").each { |r| import r }
{% endhighlight %}

I can start create a custom rake file inside the `lib/capistrano/tasks` folder. I set the task name as `run_rake.rake`.

{% highlight ruby %}
namespace :run_rake do
  desc "Run a task on a remote server."
  # run like: cap staging run_rake:invoke task=create:premium_plan
  task :invoke do
    on roles(:app) do
      within "#{current_path}" do
        with rails_env: "#{fetch(:stage)}" do
          execute :rake, ENV['task']
        end
      end
    end
  end
end
{% endhighlight %}

I can run any task from my local by running `cap (staging/production) run_rake:invoke task=task_name` from my local.
