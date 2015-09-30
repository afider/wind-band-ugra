(function ($) {

    var eCalendar = function (options, object) {
        // Initializing global variables
        var adDay = new Date().getDate();
        var adMonth = new Date().getMonth();
        var adYear = new Date().getFullYear();
        var dDay = adDay;
        var dMonth = adMonth;
        var dYear = adYear;
        var instance = object;

        var settings = $.extend({}, $.fn.eCalendar.defaults, options);

        function lpad(value, length, pad) {
            if (typeof pad == 'undefined') {
                pad = '0';
            }
            var p;
            for (var i = 0; i < length; i++) {
                p += pad;
            }
            return (p + value).slice(-length);
        }

        var mouseOver = function () {
            $(this).addClass('c-nav-btn-over');
        };
        var mouseLeave = function () {
            $(this).removeClass('c-nav-btn-over');
        };
        var mouseOverEvent = function () {
            $(this).addClass('calendar__day_over');
            var d = $(this).attr('data-event-day');
            $('div.calendar-events__i[data-event-day="' + d + '"]').addClass('calendar-events__i_over');
        };
        var mouseLeaveEvent = function () {
            $(this).removeClass('calendar__day_over')
            var d = $(this).attr('data-event-day');
            $('div.calendar-events__i[data-event-day="' + d + '"]').removeClass('calendar-events__i_over');
        };
        var mouseOverItem = function () {
            $(this).addClass('calendar__day_over');
            var d = $(this).attr('data-event-day');
            $('div.calendar__day_event[data-event-day="' + d + '"]').addClass('calendar-events__i_over');
        };
        var mouseLeaveItem = function () {
            $(this).removeClass('calendar__day_over')
            var d = $(this).attr('data-event-day');
            $('div.calendar__day_event[data-event-day="' + d + '"]').removeClass('calendar-events__i_over');
        };
        var nextMonth = function () {
            if (dMonth < 11) {
                dMonth++;
            } else {
                dMonth = 0;
                dYear++;
            }
            print();
        };
        var previousMonth = function () {
            if (dMonth > 0) {
                dMonth--;
            } else {
                dMonth = 11;
                dYear--;
            }
            print();
        };

        function loadEvents() {
            if (typeof settings.url != 'undefined' && settings.url != '') {
                $.ajax({url: settings.url,
                    async: false,
                    success: function (result) {
                        settings.events = result;
                    }
                });
            }
        }

        function print() {
            loadEvents();
            var dWeekDayOfMonthStart = new Date(dYear, dMonth, 1).getDay();
            var dLastDayOfMonth = new Date(dYear, dMonth + 1, 0).getDate();
            var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 1, 0).getDate() - dWeekDayOfMonthStart + 1;

            var cBody = $('<div/>').addClass('calendar__days');
            var cEvents = $('<div/>').addClass('calendar__events events');
            var cEventsBody = $('<div/>').addClass('calendar-events__body');
            //cEvents.append($('<div/>').addClass('calendar-events__title').html(settings.eventTitle));
            cEvents.append(cEventsBody);
            var cNext = $('<div/>').addClass('calendar__ctrl calendar__ctrl_next');
            var cMonth = $('<div/>').addClass('calendar__month');
            var cPrevious = $('<div/>').addClass('calendar__ctrl calendar__ctrl_prev');
            cPrevious.html(settings.textArrows.previous);
            cMonth.html(settings.months[dMonth] + ' ' + dYear);
            cNext.html(settings.textArrows.next);

            cPrevious.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', previousMonth);
            cNext.on('mouseover', mouseOver).on('mouseleave', mouseLeave).on('click', nextMonth);

            cBody.append(cPrevious);
            cBody.append(cMonth);
            cBody.append(cNext);
            for (var i = 0; i < settings.weekDays.length; i++) {
                var cWeekDay = $('<div/>').addClass('calendar__week-day');
                cWeekDay.html(settings.weekDays[i]);
                cBody.append(cWeekDay);
            }
            var day = 1;
            var dayOfNextMonth = 1;
            for (var i = 0; i < 42; i++) {
                var cDay = $('<a/>');
                if (i < dWeekDayOfMonthStart) {
                    cDay.addClass('calendar__day calendar__day_previous-month');
                    cDay.html(dLastDayOfPreviousMonth++);
                } else if (day <= dLastDayOfMonth) {
                    cDay.addClass('calendar__day');
                    if (day == dDay && adMonth == dMonth && adYear == dYear) {
                        cDay.addClass('calendar__day_today');
                    }
                    for (var j = 0; j < settings.events.length; j++) {
                        var d = settings.events[j].datetime;
                        if (d.getDate() == day && (d.getMonth() - 1) == dMonth && d.getFullYear() == dYear) {
                            cDay.addClass('calendar__day_event').attr('data-event-day', d.getDate());
                            cDay.on('mouseover', mouseOverEvent).on('mouseleave', mouseLeaveEvent);
                        }
                    }
                    cDay.html(day++);
                } else {
                    cDay.addClass('calendar__day calendar__day_next-month');
                    cDay.html(dayOfNextMonth++);
                }
                cBody.append(cDay);
            }
            var eventList = $('<div/>').addClass('calendar-events__list');
            for (var i = 0; i < settings.events.length; i++) {
                var d = settings.events[i].datetime;
                if ((d.getMonth() - 1) == dMonth && d.getFullYear() == dYear) {
                    var date = lpad(d.getDate(), 2) + '/' + lpad(d.getMonth(), 2) + ' ' + lpad(d.getHours(), 2) + ':' + lpad(d.getMinutes(), 2);
                    var item = $('<div/>').addClass('calendar-events__i');
                    var link = settings.events[i].link;
                    var title = $('<a href="' + link + '" />').addClass('calendar-events__name').html(settings.events[i].title);
                    //var description = $('<div/>').addClass('calendar-events__description').html(settings.events[i].description + '<br/>');
                    var timeLabel = 'Время мероприятия';
                    var ageLabel = 'Ограничение по возрасту';
                    var minimumAge = $('<span/>').addClass('calendar-events__imp').html(settings.events[i].minimumAge);
                    var eventTime = $('<span/>').addClass('calendar-events__imp').html(settings.events[i].eventTime);
                    var property1 = $('<div/>').addClass('calendar-events__property').html(timeLabel);
                    var property2 = $('<div/>').addClass('calendar-events__property').html(ageLabel);

                    var eventDate = d.getDate();
                    var eventMonth = settings.months[dMonth];
                    var eventDateBlock = '<div class="calendar-events__date"><div class="calendar-events__number">' + eventDate + '</div><div class="calendar-events__weekday">' + eventMonth + '</div></div>';

                    console.log(eventDateBlock);

                    item.attr('data-event-day', d.getDate());
                    item.on('mouseover', mouseOverItem).on('mouseleave', mouseLeaveItem);
                    //item.append(title).append(description);
                    property1.append(eventTime);
                    property2.append(minimumAge);

                    item.append(title)
                        .append(eventDateBlock)
                        .append(property1)
                        .append(property2);

                    eventList.append(item);
                }
            }
            $(instance).addClass('calendar');
            cEventsBody.append(eventList);
            $(instance).html(cBody).append(cEvents);
        }

        return print();
    }

    $.fn.eCalendar = function (oInit) {
        return this.each(function () {
            return eCalendar(oInit, $(this));
        });
    };

    // plugin defaults
    $.fn.eCalendar.defaults = {
        weekDays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        textArrows: {previous: '', next: ''},
        eventTitle: 'События',
        url: '',
        events: [
            {
                title: 'Заголовок события', 
                link: '#1', description: 'Описание события', 
                eventTime: '15:30', 
                minimumAge: '+18', 
                datetime: new Date(2015, 9, 29)
            },
            {
                title: 'Заголовок события1111', 
                link: '#2', 
                description: 'Описание события11111', 
                eventTime: '15:30', 
                minimumAge: '+18', 
                datetime: new Date(2015, 9, 29)
            },
            {
                title: 'Заголовок события2', 
                link: '#3', 
                description: 'Описание события222', 
                eventTime: '15:30', 
                minimumAge: '+12', 
                datetime: new Date(2015, 9, 17)
            },
            {
                title: 'Заголовок события3', 
                link: '#4', 
                description: 'Описание события333', 
                eventTime: '15:30', 
                minimumAge: '+16', 
                datetime: new Date(2015, 9, 23)
            },
            {
                title: 'Заголовок события3', 
                link: '#5', 
                description: 'Описание события333', 
                eventTime: '15:30', 
                minimumAge: '+16', 
                datetime: new Date(2015, 10, 23)
            }
        ]
    };

}(jQuery));