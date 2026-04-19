# Personal website
My personal website based on [Parchment](https://github.com/rhl-bthr/parchment), a clean, single column blog template built for jekyll.

## Building locally
* Clone the repository
* Run `bundle install`
* Run `bundle exec jekyll serve --incremental`
* Visit browser at `http://127.0.0.1:4000/`

## Usage
* You can customise variables in `_config.yml` and `css/*` files.
* You can add markdown files, say `foo.md` in the root directory
  of the repository. It will then be accessible like
  `your.website.com/foo`.
* To add posts, add your posts in the `_posts` directory. Follow
  the naming convention `%yyyy-%mm-%dd-your-title-here.md`. 
  Subdirectories are included recusively.
* To add a profile picture, use class `profile-picture` around
  the image.
* To change the footer, edit it directly under `_includes/footer.html`