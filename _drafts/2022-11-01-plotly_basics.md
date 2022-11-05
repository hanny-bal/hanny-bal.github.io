---
layout: post
title:  "It moves! Interactive data visualization in R with Plotly. Part 1: Basics"
date:   2022-11-03 00:00:00 +0100
excerpt: Most data is easy to visualize – but doing it well is hard. In-between axis names, color schemes and orientiations, lots of data visualization tools one can easily get lost. A guide to navigating this wilderness with Plotly.
thumbnail: /images/2022/2022-11-05-plotly_thumbnail.png
tag: Data Science
useplotly: true
# usemathjax: true
---

Data visualization. It's the best and worst thing simultaneously – it's creative and fun, one gets to play around with different types of plots, colors and symbols. At the same time, it's impossible to perfect. Just like writing or art. And then there's the aspect of conveying the underlying message the right way. A well-done, aesthetic plot is truly a hard task. There are many examples for excellent data visualization though – specifically in data journalism. A recent article I really liked was [Following the Science](https://pudding.cool/2021/03/covid-science/){:target="_blank"} by The Pudding which aims to summarize global research efforts regarding the coronavirus pandemic.

But you're probably here for something different: Interactive data visualization with R. We do it because interactivity is helpful and lets the user explore the data by hand. Furthermore, one can always convert an interactive plot into a static one but not necessarily vice-versa.

## Why Plotly and why R?
To get started, we will cover Plotly because it's one of the most popular open source graphing libraries[^1] and available for all important scientific programming languages – including Python, R, Julia and Matlab. As it is written in JavaScript, the resulting plots can be embedded arbitrarily in websites and other HTML documents.

We specifically focus on Plotly for R because R – while being a horrible programming language – is unbeatable for data wrangling, offers some neat integrated datasets and generally doesn't require a deep knowledge of programming to use. If you're not familiar with R, you can learn the basics in Datacamp's free [introductary course](https://www.datacamp.com/courses/free-introduction-to-r){:target="_blank"} or read up Tim Smith's [(angry) newcomer's guide to R](http://arrgh.tim-smith.us/){:target="_blank"}. The mere basics should already suffice to follow this tutorial.

## Setup
In order to use Plotly, we start by installing it using the command `install.packages("plotly")` and loading it using `library(plotly)`. That's all we need. 

Now, there are generally two ways to create an interactive plot at this point:
- Either by converting a static ggplot2 visualization into an interactive plotly visualization
- or by creating a plotly visualization from scratch using the command `plot_ly()` in combination with layout and styling options.

As it's more powerful to use Plotly directly, we will mainly focus on the second way. The `plot_ly()` function is the key to the world of plots here. It provides a direct interface to the underlying plotly.js framework and includes some convenient abstractions to reduce typing. 

At this point, let's look at our first example plot.
```r
plot_ly(
  data = iris,
  x = ~Petal.Length,
  y = ~Petal.Width,
  type = "scatter",
  mode = "markers",
  color = ~Species, 
  hoverinfo = 'text',
  text = ~Species
)
```

<iframe src="/assets/plotly/p1_basic.html" height="600px" width="100%" style="border:none; margin-top:20px;"></iframe>

Go ahead and play around a bit – Plotly lets you zoom and interact with data points. Obviously, created a plot of the data set `iris` in this case. The x-axis is defined by the variable `Petal.Length` of the data set and the y-axis by the variable `Petal.Length`. Note that data variables must have a tilde (~) as prefix in Plotly. The type of the plot should be a scatter plot and the data points should be represented as markers, i.e. points. We could also use `lines` or `lines+markers` for this options. Furthermore, the color of a data point should be defined by the `Species` and hovering displays a text containing the `Species`.

## Layers over layers

Normally, we don't use the `plot_ly` command in such a standalone way. Instead, it makes sense to create a plot layer by layer – offering maximum flexibility for the user. To do this, we use a few tricks.

- First of all, Plotly supports the pipe operator `%>%` which "pipes" a value into a function allowing the programmer to write code sequentially instead of inside-out. For example, if consider a variable `x`, writing `x %>% f()` would be equivalent to `f(x)`.
- Secondly, a Plotly object can be populated using the family of `add_*()` functions. Examples are `add_markers()` for scatter plots, `add_lines()` for line plots or simply the generic version `add_trace()` which allows us to specify the type and mode explicitely as in the above example.
- Even just using `add_trace()` brings the advantage of being apple to layer multiple traces onto one plot.
- Additionally, the layout of a plot is mainly defined by the `layout()` function. 
 
Let's plot a simple linear regression with the help of these new tricks.

```r
# first, let's remove values that are NA (not available)
iris <- iris %>%
  filter(!is.na(Petal.Width))

# then compute a linear regression model
model <- lm(Petal.Width ~ Petal.Length, data = iris)

# and plot the result
iris %>% 
  plot_ly() %>% 
  add_markers(x = ~Petal.Length, y = ~Petal.Width,
              color = ~Species, hoverinfo = 'text',
              text = ~Species) %>% 
  add_lines(x = ~Petal.Length, y = fitted(model),
            name = 'regression line') %>% 
  layout(title = 'Linear regression based on the iris data',
         xaxis = list(title = 'Petal Length'),
         yaxis = list(title = 'Petal Width'))
```

<iframe src="/assets/plotly/p2_regression.html" height="600px" width="100%" style="border:none; margin-top:20px;"></iframe>

What happens is that we initially create an empty plotly object. In the second step (after the second pipe operator), we add a layer with markers for our data points. Subsequently, we add another layer that contains the regression line. Finally, we customize the title and axes using the `layout()` function. 

As there is an almost infinite amount of customization options for each command in Plotly, I recommend checking out the documentation at [plotly.com/r/](https://plotly.com/r/){:target="_blank"} for further details on a function. In 99% of the cases, there will be an appropriate argument to achieve whatever you desire.

## Moving on from ggplot
In the overview, I mentioned that another way to create an interactive Plotly visualization is to convert a static ggplot2 graphic into an interactive Plotly object. If you already know ggplot2, this is the easiest task on earth. All you need to do is to go ahead and wrap your ggplot in Plotly's `ggplotly()` function.

As always, the best way to learn is by example. We will use the `tips` data set which contains information about tips in restaurants.

```r
# first, we create a static plot
static_plot <- tips %>%
  # filter the data set for tips that were made on a Friday 
  filter(day== "Fri") %>% 
  # create a static ggplot
  ggplot(., aes(x=total_bill, y= tip))+
  # create a scatter plot
  geom_point() +
  # and add a title
  ggtitle('Total bill and tip') +
  # make the theme black and white
  theme_bw()

# convert the static plot to an interavtive plot
ggplotly(static_plot)
```

![](/images/2022/2022-11-05-ggplot_example.png)
*A boring static plot.*

<iframe src="/assets/plotly/p3_ggplotly.html" height="600px" width="100%" style="border:none; margin-top:20px;"></iframe>

The difference should be clear – and the conversion is easier than taking a sip of water without spilling.

## Squish, squish
We'll end this tutorial with a note on how to merge multiple Plotly graphics into one and how to create facets (i.e. different views) based on a certain variable. This is one of the most common challenges of data visualization because sometime the information just doesn't fit into one plot. In such a case, it can make sense to create multiple views instead of one huge one.

Generally, plots can be combined using the command `subplot()`, e.g. `subplot(p1, p2, nrows = 2)`. The function is as straightforward as it gets. Exploiting it to create facets based on a specified variable, however, is a bit more complicated. We can only do this with the help of the package `dplyr` which is very(!) popular for data wrangling. Specifically, we need the `do()` function from it. It performs an arbitrary computation and returns a list of values. Pouring this into an example, we could do the following.

```r
# we start with the tips data set
tips %>% 
  # then we make groups by day
  group_by(day) %>%
  # for each group (each day), we create a plotly object
  # and add markers to it
  do(plot=plot_ly(data=.,x =~ total_bill, y=~tip) %>%
       add_markers(name=~day)) %>%
  # the result is a list that we put into a subplot with two rows
  subplot(nrows=2) %>% 
  # we can also add a layout and title to the subplot
  layout(title = 'Side By Side Subplots')
```

<iframe src="/assets/plotly/p4_facets.html" height="600px" width="100%" style="border:none; margin-top:20px;"></iframe>


## Conclusion
That's it! For now. Hopefully, this article showed you the power and ease of Plotly for interactive data visualization. There will be subsequent posts regarding maps, animations and some special effects. The possibilities are endless. For now, go ahead and play around if you haven't already. And let's move on from boring static graphics to cool interactive ones.

P.S.: You can always export a Plotly graph as a static image, either by clicking on *Download plot as png* (the camera symbol) in a plot or by using the procedures from the [documentation](https://plotly-r.com/exporting-static-images.html){:target="_blank"}.

P.P.S.: Seriously, read the documentation[^2] if you're interested. It's one of the best out there and contains everything imaginable.


## References

[^1]: https://plotly.com/graphing-libraries/
[^2]: https://plotly.com/r/