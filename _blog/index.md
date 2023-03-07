---
# Feel free to add content and custom Front Matter to this file.
# To modify the layout, see https://jekyllrb.com/docs/themes/#overriding-theme-defaults

layout: default
---

{% for post in site.posts %}
  <article>
    <time datetime="{{ post.date | date: "%Y-%m-%d" }}" class="post-date">{{ post.date | date_to_long_string }}</time>
    <div class="tag-wrapper"> 
      <span class="tag-text">{{ post.tag }}</span>
    </div>
    <div class="flex-container">
      <div class="post-flex-left">
        <h1 class="post-list-title">
          <a href="{{ post.url }}">
            {{ post.title }}
          </a>
        </h1>
        {{ post.excerpt }}
      </div>
      <div class="post-flex-right">
        <div class="thumbnail-box">
          {% if post.thumbnail %}
            <img class="thumbnail-img" src="{{ post.thumbnail }}" />
          {% endif %}
        </div>
      </div>
    </div>
  </article>
{% endfor %}