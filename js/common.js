(function ($) {
    var uid = 1;
    $.fn.customCheckbox = function () {
        return this.each(function () {
            var self = $(this),
                input = self.find('input'),
                type = input.attr('type'),
                name = (input.attr('name') || 'custom_' + type + '_' + uid++).replace(/[^a-zA-Z0-9_\-]/g, '_');

            self.addClass('is-' + type).addClass(name);

            input.change(function () {
                if (type === 'radio') {
                    $('.' + name).removeClass('on');
                }
                self[ $(this).is(':checked') ? 'addClass' : 'removeClass' ]('on');
            });

            self[ input.is(':checked') ? 'addClass' : 'removeClass' ]('on');
        });
    };
}(jQuery));


(function (exports, $) {
    "use strict";

    $(function () {

        // кастомные чекбоксы/радио кнопки
        $('.js-cr').customCheckbox();

        // Подключение плагина всплывающих окон
        // Add it after jquery.magnific-popup.js and before first initialization code
        $.extend(true, $.magnificPopup.defaults, {
          tClose: 'Закрыть (Esc)', // Alt text on close button
          tLoading: 'Идет загрузка...', // Text that is displayed during loading. Can contain %curr% and %total% keys
          gallery: {
            tPrev: 'Предыдущая (или кнопка «влево»)', // Alt text on left arrow
            tNext: 'Следающая (или кнопка «вправо»)', // Alt text on right arrow
            tCounter: '%curr% из %total%' // Markup for "1 of 7" counter
          },
          image: {
            tError: '<a href="%url%">Изображения по такой ссылке</a> нет.' // Error message when image could not be loaded
          },
          ajax: {
            tError: '<a href="%url%">Содержимое</a> не загружается.' // Error message when ajax request failed
          }
        });

        $('.js-popup').magnificPopup({
                type: 'inline',

                fixedContentPos: true,
                fixedBgPos: true,

                overflowY: 'auto',

                closeBtnInside: true,
                preloader: false,
                
                midClick: true,
                removalDelay: 300,
                mainClass: 'my-mfp-slide-bottom'
            });

        $('.js-popup-video').magnificPopup({
                disableOn: 700,
                type: 'iframe',
                mainClass: 'mfp-fade',
                removalDelay: 160,
                preloader: false,

                fixedContentPos: false
            });

        // Подключение плагина для увеличения и просмотра изображений
        var zoomClass = 'js-img-zoom';
        $('.'+ zoomClass).magnificPopup({
            gallery:{enabled:true},
            delegate: '.' + zoomClass + '__target', // child items selector, by clicking on it popup will open
            type: 'image',

            image: {
                titleSrc: function(item) {
                    var imgDate = item.el.attr('data-date');
                    var imgTitle = item.el.attr('title');
                    if (imgDate === undefined) {imgDate = '';}
                    if (imgTitle === undefined) {imgTitle = '';}
                    var imgCapture = '<small class="mfp-title__date">' + imgDate + '</small>' + imgTitle;
                    return imgCapture;
                }
            },

            mainClass: 'mfp-with-zoom', // this class is for CSS animation

              zoom: {
                enabled: true, // By default it's false, so don't forget to enable it

                duration: 300, // duration of the effect, in milliseconds
                easing: 'ease-in-out', // CSS transition easing function 

                // The "opener" function should return the element from which popup will be zoomed in
                // and to which popup will be scaled down
                // By defailt it looks for an image tag:
                opener: function(openerElement) {
                  // openerElement is the element on which popup was initialized, in this case its <a> tag
                  // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                  return openerElement.is('img') ? openerElement : openerElement.find('img');
                }
              }

        });


        // анимация родительских пунктов меню
        var parentItem = $(".main-nav__i_parent");
        var parentItemCtrl = $(".main-nav__i_parent .main-nav__a");

        parentItemCtrl.on('click', function(e) {
            e.preventDefault();

            var self = $(this),
                target = $('.' + self.data('nav'));

            self.parent().toggleClass('main-nav__i_open');

        });

        $(document).click(function(e){
            if ($(e.target).parents().andSelf().filter('.main-nav').length != 1) {
                parentItem.removeClass('main-nav__i_open');
            }
        });

        // анимация мобильного меню
        $(".js-nav-ctrl").on('click', function(e) {
            e.preventDefault();
            var self = $(this),
                target = $('.' + self.data('nav'));

            self.toggleClass('is-open');
            target.toggleClass('is-open');
        });

        // инициализация плагина для адаптивных таблиц
        $('.table_responsive').cardtable();

        $('.js-popup-video').each(function() {
            
            var self = $(this);
            var videoSrc = self.attr('href');
            var videoId = videoSrc.substr(videoSrc.length - 11);
            var videoImg = $('<img src="//img.youtube.com/vi/'+ videoId +'/0.jpg" class="img-teasers__img">');

            console.log(videoSrc, videoId);

            self.append(videoImg);
        });



    });
}(this, jQuery));
