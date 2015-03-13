# 职责：工具栏
# TODO：整理重构，去掉无用代码。
# TODO：重命名为utils.ls

################# extend object with methods #####################
String.prototype.capitalize = -> (@char-at 0 .to-upper-case!) + (@slice 1)
String.prototype.camelize  = (is-first-uppercase = false)-> 
    @split '-' .map ((token, index)->  if index is 0 and not is-first-uppercase then token else token.capitalize!) .join ''
String.prototype.contains  = (substr)-> (@.index-of substr) > -1
Array.prototype.any-contains = (str)->
  [return true if typeof e is 'string' and e.contains str for e in @]
  false

Array.prototype.next = do ->
  index = 0
  ->
    @[index++ % @.length]
Array.prototype.find-index = (obj)->
  [return i for element, i in @ when obj is element]
  null
# Function.prototype.decorate = ({before, after})-> ~> before? ... ; @ ... ; after? ...
Function.prototype.decorate = ({before, after, is-passing-arguments})-> 
  let b = before, a = after, self = @ # 注意，必须用闭包保证回调时before、this、after的正确性！
    if is-passing-arguments # 将before执行完结果，作为参数给self，self执行完的结果，作为参数给after
      -> 
        b-r = b? ...
        s-r = if b-r then self b-r else self ...
        a-r = (a? s-r) or s-r
        # b-r = b? ... ; s-r = self b-r ; a-r = a? s-r
        # a-r or s-r or b-r
    else
      -> b? ... ; self ... ; a? ...

Function.once = (fn)->
  is-called = false
  -> (is-called := true ; fn ...) if not is-called

################# extend object with methods #####################

/*
  @Description: 异步处理
  @Author: Wangqing
  @Date: 2014/10/4
  @Version: 0.0.2
 */
class All-done-waiter
  @all-complete = (collection, fn-name, done)!-> # collection内的每个元素都有 fn-name(done)这样的方法
    return done! if Array.is-array collection and collection.length is 0
    waiter = new @ done
    waiters = {}
    # [waiters[key] = (@get-log-funtion element, waiter.add-waiting-function!) for key, element of collection] # 为每个方法产生一个waiter
    [waiters[key] = waiter.add-waiting-function! for key, element of collection when collection.has-own-property key] # 为每个方法产生一个waiter
    [element[fn-name]? waiters[key] for key, element of collection] # 执行所有方法，执行后，才会执行done。

  @get-log-funtion = (element, done)->
    -> console.log "******* syncer initialized, state: #{element.state.name}, via channel: #{element.channel.name}" ; done!


  @all-done-one-by-one = (collection, fn-name, done)!->
    fn = done
    for element in collection.reverse!
      let f = fn
        fn := !-> element[fn-name]? f
    fn!

  (@done)->
    @count = 0

  add-waiting-function: (fn)->
    fn ||= -> 1 + 1
    @count += 1
    new-fn = !~>
      fn.apply null, arguments
      @count -= 1
      @check!
    new-fn  

  check: !->
    @done! if @count is 0


# rem = -> parse-float($ 'body' .css 'font-size')
# rem = -> parse-int(window.get-computed-style document.document-element .font-size)

# px-to-rem = (px)-> (parse-int px) / rem!

# rem-to-px = (_rem)-> _rem * rem!

# convert-to-px = (str)->
#   [all, number-str, unit] = str.match /([0-9.]+)([^0-9.]+)/
#   switch
#   | unit is 'px'        => parse-int number-str
#   | unit is 'rem'       => rem-to-px parse-float number-str
#   | otherwise           => NaN




# color-luminance = (hex, lum) -> # 出自：http://www.sitepoint.com/javascript-generate-lighter-darker-color/
#   # validate hex string
#   hex = String(hex).replace(/[^0-9a-f]/g, "")
#   hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]  if hex.length < 6
#   lum = lum or 0
  
#   # convert to decimal and change luminosity
#   rgb = "#"
#   c = undefined
#   i = undefined
#   i = 0
#   while i < 3
#     c = parseInt(hex.substr(i * 2, 2), 16)
#     c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16)
#     rgb += ("00" + c).substr(c.length)
#     i++
#   rgb


 
  # require! {$:'jquery', 'jquery.cookie', 'jquery-debounce'} # 为了处理cookie
  # event-proxy = $ document 

  # {rem, convert-to-px, px-to-rem, rem-to-px, color-luminance} <<< 

    # debounce: $.debounce # 便于未来去掉对jQuery的依赖x

    # throttle: $.throttle

    # get-real-text-size: (chinese-english-text)-> # 参考：http://www.puritys.me/docs-blog/article-107-String-Length-%E4%B8%AD%E6%96%87%E5%AD%97%E4%B8%B2%E9%95%B7%E5%BA%A6.html
    #   chinese-english-text.replace /[^\x00-\xff]/g, "**" .length
      
    # events:
    #   on: -> event-proxy.on.apply event-proxy, &
    #   trigger: -> event-proxy.trigger.apply event-proxy, &

    # host-page:
    #   on: (host-page-message-type, handler)!->
    #     $ window .on 'message', (event)!-> handler event if event.original-event.data.type is host-page-message-type 
    #   trigger: (host-page-message-type, data = {})!->
    #     window.parent.post-message {type: host-page-message-type} <<< data, target-domain = '*'

util = ->
  is-number: (number-or-str)-> not is-NaN number-or-str

  All-done-waiter: All-done-waiter

  get-random-key: -> '' + Date.now! + Math.random!

  get-key-of-value: (obj, value)->
    [return key for key in Object.keys obj when obj[key] is value]
    null 

if define? # a+运行时
  define 'util', [], util
else # 独立运行
  root = module?.exports ? @
  root.util = util!










