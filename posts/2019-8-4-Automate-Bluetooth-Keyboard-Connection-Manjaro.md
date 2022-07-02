---
slug: "automate-bluetooth-keyboard-connection-manjaro"
title: Automate Bluetooth Keyboard Connection — Manjaro
date: 2019-08-04 23:05
categories: linux
image: '002'
tags: blog linux manjaro
description: I was upset when using bluetooth keyboard on Linux machine, Manjaro. I had to reconnect my bluetooth keyboard everytime I login to my machine. But, I've found a way to automate the bluetooth keyboard connection when logging in to my machine.
---

I was upset when using bluetooth keyboard on Linux machine, Manjaro. I had to reconnect my bluetooth keyboard everytime I login to my machine. But, I've found a way to automate the bluetooth keyboard connection when logging in to my machine.

I setup an application autostart item. I am using XFCE desktop. So, what I did
is open **Session and Startup**. Then, go to **Application Autostart**. Add
new item. After that, enter the code below inside the **Command** text input.

{% highlight bash %}
echo 'connect DC:2C:26:EF:99:63' | bluetoothctl.
{% endhighlight %}

Replace the `DC:2C:26:EF:99:63` with your bluetooth device address. Set the
**Trigger** to **on login**. Restart the
machine and make sure that the bluetooth device is on. You will see that the
device will be connected automatically when logging in.
