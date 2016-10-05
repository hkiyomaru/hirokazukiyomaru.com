wrap = $(".wrap")
loader_bg = $(".loader-bg")
loader = $(".loader")
h = $(window).height()

$ ->
  wrap
  .css
    'display': 'none'
  loader_bg
  .height h
  .css
    'display': 'block'
  loader
  .height h
  .css
    'display': 'block'

$(window).load ->
  $('.loader-bg')
  .delay 900
  $('.loader-bg')
  .fadeOut 800
  $('.loader')
  .delay 600
  $('.loader')
  .fadeOut 300
  $('.wrap')
  .css
    'display': 'block'

$ ->
  setTimeout(stopload(), 10000)

stopload = ->
  wrap
  .css
    'display': 'block'
  loader_bg
  .delay(900)
  .fadeOut(800)
  loader
  .delay(600)
  .fadeOut(300)

$("#showMore").click ->
  $(".more")
  .slideToggle()
