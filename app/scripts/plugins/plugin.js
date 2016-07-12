/**
 *  @name plugin
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */

;(function($, window, undefined){
  'use strict';
  var pluginName = 'slider';
  // var privateVar = null;
  // var privateMethod = function(el, options){

  // };
  function Plugin(element, options){
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function(){
      //var that = this;
      this.vars = {
        currSlide : 0,
        $currSlide: null,
        totalSlides : false,
        csstransitions: false
      };
      //initialize
      //this.csstransitionsTest();
      this.changeSlide = $.proxy(this.changeSlide,this);
      this.element.addClass('zippy-carousel');
      this.build();
      this.events();
      this.activate();
      this.initTimer();
      //add event
    },
    // csstransitionsTest: function(){
    //   //todo
    //   var elem = document.creatElement('modernizr');
    //   var props = ['transition','WebkitTransition','MozTransition','OTransition','msTransition'];
    //   for (var i in props) {
    //     var prop = props[i];
    //     var result = elem.style[prop] !== undefined ? prop : false ;
    //     if (result) {
    //       this.csstransitions = result;
    //       break;
    //     }
    //   }
    // },

    addCSSDuration: function(){
      //todo
      var _ = this;
      this.element.find('.slide').each(function(){
        this.style[_.vars.csstransitions+'Duration'] = _.options.speed+'ms';
      });
    },

    removeCSSDuration: function(){
      //todo
      var _ = this;
      this.element.find('.slide').each(function(){
        this.style[_.vars.csstransitions+'Duration'] = '';
      });
    },

    build: function(){
      //todo
      var $indicators = this.element.append('<ul class="indicators">').find('.indicators');
      this.vars.totalSlides = this.element.find('.slide').length;
      for (var i = 0; i < this.vars.totalSlides; i++) {
        $indicators.append('<li data-index='+i+'>');
      }
    },

    activate: function(){
      //todo
      this.vars.$currSlide = this.element.find('.slide').eq(0);
      this.element.find('.indicators li').eq(0).addClass('active');
    },

    events: function(){
      //todo
      $('body')
        .on('click',this.options.arrowRight,{direction:'right'},this.changeSlide)
        .on('click',this.options.arrowLeft,{direction:'left'},this.changeSlide)
        .on('click','.indicators li',this.changeSlide);
    },

    clearTimer: function(){
      //todo
      if(this.timer){
        clearInterval(this.timer);
      }
    },

    initTimer: function(){
      //todo
      this.timer = setInterval(this.changeSlide, this.options.slideDuration);
    },

    startTimer: function(){
      //todo
      this.initTimer();
      this.throttle = false;
    },

    changeSlide: function(e){
      //todo
      if(this.throttle){
        return;
      }
      this.throttle = true;
      this.clearTimer();
      var direction = this._direction(e);
      var animate = this._next(e,direction);
      if(!animate){
        return;
      }
      var $nextSlide = this.element.find('.slide').eq(this.vars.currSlide).addClass(direction + ' active');
      if (!this.vars.csstransitions) {
        this._jsAnimation($nextSlide,direction);
      } else{
        this._cssAnimation($nextSlide,direction);
      }
    },

    _direction: function(e){
      //todo
      var direction;
      if (typeof e !== 'undefined') {
        direction = (typeof e.data === 'undefined' ? 'right' : e.data.direction);
      } else{
        direction = 'right';
      }
      return direction;
    },

    _next: function(e,direction){
      //todo
      var index = (typeof e !== 'undefined' ? $(e.currentTarget).data('index') : undefined);
      switch(true){
        case(typeof index !== 'undefined'):
          if (this.vars.currSlide === index) {
            this.startTimer();
            return false;
          }
          this.vars.currSlide = index;
        break;
        case(direction === 'right' && this.vars.currSlide < (this.vars.totalSlides -1)):
          this.vars.currSlide++;
        break;
        case(direction === 'right'):
          this.vars.currSlide = 0;
        break;
        case(direction === 'left' && this.vars.currSlide === 0 ):
          this.vars.currSlide = (this.vars.currSlide -1);
        break;
        case(direction === 'left'):
          this.vars.currSlide--;
        break;
      }
      return true;
    },

    _cssAnimation: function($nextSlide,direction){
      //todo
      setTimeout(function(){
        this.element.addClass('transition');
        this.addCSSDuration;
        this.vars.$currSlide.addClass('shift-' +direction);
      }.bind(this),100);

      setTimeout(function(){
        this.element.removeClass('transition');
        this.removeCSSDuration();
        this.vars.$currSlide.removeClass('active shift-left shift-right');
        this.vars.$currSlide = $nextSlide.removeClass(direction);
        this._updateIndicators();
        this.startTimer();
      }.bind(this),100 + this.options.speed);
    },

    _jsAnimation: function($nextSlide,direction){
      //todo
      var _ = this;
      if (direction === 'right') {
        _.vars.$currSlide.addClass('js-reset-left');
      }

        var animation = {};
        animation[direction] = '0%';
        var animationPrev = {};
        animationPrev[direction] = '100%';
        this.vars.$currSlide.animate(animationPrev,this.options.speed);
        $nextSlide.animate(animation,this.options.speed, 'swing',function(){
          _.vars.$currSlide.removeClass('active js-reset-left').attr('style', '');
          _.vars.$currSlide = $nextSlide.removeClass(direction).attr('style', '');
          _._updateIndicators();
          _.startTimer();
        });
    },

    _updateIndicators: function(){
      //todo
      this.element.find('.indicators li').removeClass('active').eq(this.vars.currSlide).addClass('active');
    },

    destroy: function(){
      // remove events
      // deinitialize
      $.removeData(this.element[0], pluginName);
    }

  };

  $.fn[pluginName] = function(options, params){
    return this.each(function(){
      var instance = $.data(this, pluginName);
      if(!instance){
        $.data(this, pluginName, new Plugin(this, options));
      } else if(instance[options]){
        instance[options](params);
      }
    });

  };

  $.fn[pluginName].defaults = {
    slideDuration: 3000,
    speed: 500,
    arrowLeft: '.arrow-left',
    arrowRight: '.arrow-right',
    key: 'value',
    onCallback: null
  };

  $(function(){
    $('[data-' + pluginName + ']').on('customEvent',function(){
      // todo
    });

    $('[data-' + pluginName + ']')[pluginName]({
      key: 'custom'
    });

  });

}(jQuery, window));
