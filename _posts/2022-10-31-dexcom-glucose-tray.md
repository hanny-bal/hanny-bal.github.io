---
layout: post
title:  "Real-Time Glucose Levels in Gnome"
date:   2022-10-31 19:08:00 +0100
excerpt: Are you wearing a Dexcom (G4, G5 or G6) Continuous Glucose Monitoring system and want to display your current glucose level in Gnome's top tray bar? Then you have come to the right place!
thumbnail: /images/2022/2022-10-31-dexcom-tray-thumbnail-hd.png
tag: Technology, Linux
# usemathjax: true
---

Diabetes technology has advanced a lot in recent years: Glucose sensors and their respective apps bring blood sugar measurements right to the smartphone, the first closed-loop systems are hitting the market and diabetes management increasingly happens digitally. With a good part of the generated data being stored in the cloud, the field also becomes more and more interesting for developers and data scientists.

Many diabetics with a Continuous Glucose Monitoring (CGM) or Flash Glucose Monitoring (FGM) system might know the dilemma: You want to power through a focused session of work without distractions but yet you regularly have to pick up your phone to check your glucose levels – breaking the flow every time.

At least for users of the Dexcom G4, G5 and G6, I present a solution to this problem. Granted, it currently only works on Linux with a [Gnome desktop environment](https://www.gnome.org/) but should easily be extendable to MacOS.

## Prerequisites
The big advantage of the Dexcom CGM system is that its app offers the so-called *share* functionality which is originally there to share one's glucose values with another person, e.g. a relative, in real-time. In our solution, we exploit exactly this feature by accessing its API.

Therefore, the share functionality must be activated in the Dexcom app and at least one follower has to exist for the following steps to work. The follower doesn't have to be active though.

## The plan
With the Dexcom share connection set up, we can now access it using a myriad of API calls [^1]. My first thought was to build a Gnome extension that executes the necessary API calls and displays the result in the tray bar. While this might seem like an easy task, Gnome shell puts a huge spoke in the wheel. Building a proper extension requires the use of the [gjs JavaScript library](https://gjs.guide/extensions/development/creating.html#a-working-extension){:target="_blank"} which is not only super specific and lengthy but also lacks a straightforward documentation. Even more, the complexity of HTTP request comes straight out of hell in gjs. After a few hours of trying to access just one of the APIs – let alone display anything – I decided that the disproportionate time and lines of code weren't worth the effort.

Luckily, the open source community saves the day with [Argos](https://github.com/p-e-w/argos){:target="_blank"}: An extension wrapper for Gnome that makes it possible to only write the core logic of the desired extension in an arbitrary script (e.g. Bash or Python). The produced standard output is then parsed and transformed into a tray extension. Sounds awesome, right? Well, it is!

Additionally, there is the neat Python package [pydexcom](https://github.com/gagebenne/pydexcom){:target="_blank"} which automatizes the needed API calls to access the Dexcom share service. Thus, all we need to install is Argos and pydexcom and we're ready to go.

# Setup
With everything ready, make sure to activate the Argos for Gnome in the extensions menu. An example menu should pop up in the tray bar. To configure Argos for our needs, first navigate to `~/.config/argos`. You will find an example script named `argos.sh` which displays the mentioned menu in the tray bar. To deactivate it, simply hide the file by renaming it to .argos.sh.

Next, create a simple Python script that is named something like `glucose_runner.5m.py` in the Argos config folder. `glucose_runner` is the name of our custom extension which can be changed arbitrarily and the `5m` part states that the file is rerun every five minutes. This interval can be changed according to your needs. However, smaller intervals don't make a lot of sense as the Dexcom G6 sensor only sends a new glucose value every five minutes.

With the most minimal configuration, the `glucose_runner.5m.py` Python file can look as follows:

```python
#!/usr/bin/env python3

from pydexcom import Dexcom

# set ous to True if outside the US, otherwise False
dexcom = Dexcom("username", "password", ous = True)

# read and display the blood sugar value and trend arrow
bg = dexcom.get_current_glucose_reading()
print(f'{bg.value} {bg.trend_arrow}')
```

Make sure to enter the correct username – which is the email address – and password of your default Dexcom user. Don't use the follower! When the script is saved, the output should immediately appear in the top tray bar:

![](/images/2022/2022-10-31-dexcom-tray-example-hd.png)
*The result should look something like this.*

There we have it: A real-time glucose indicator in the tray!

## Conclusion and discussion
Obviously, the above solution relies on a bunch of third-party tools. This might not be ideal for everyone. However, eases the pain of maintenance if anything within Gnome or the Dexcom APIs changes. Moreover, it is restricted to Linux in combination with Gnome which only very few people are running. Luckily, there's a similar extension to Argos on MacOS called [xbar](https://xbarapp.com/){:target="_blank"} (previously BitBar). The setup should be completely analogous.

On Windows, the case is a bit more complicated, though still possible. With a proper Python library like [PyQt5](https://pypi.org/project/PyQt5/){:target="_blank"}, a system tray item should still only require a few lines of code.[^2]

## References

[^1]: https://github.com/nightscout/share2nightscout-bridge/issues/15
[^2]: https://www.geeksforgeeks.org/system-tray-applications-using-pyqt5/