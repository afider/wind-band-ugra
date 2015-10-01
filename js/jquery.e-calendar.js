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
        var mouseClickEvent = function () {
            $('.calendar__day').removeClass('calendar__day_over');
            $('.calendar-events__i').removeClass('calendar-events__i_over');
            $(this).addClass('calendar__day_over');
            var d = $(this).attr('data-event-day');
            $('div.calendar-events__i[data-event-day="' + d + '"]').addClass('calendar-events__i_over');
        };
        var calendarClickEvent = function () {
            $('.calendar__day_event').addClass('calendar__day_over');
            $('.calendar-events__i').addClass('calendar-events__i_over');
            console.log('msg');
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
           // var dWeekDayOfMonthStart = new Date(dYear, dMonth, 1).getDay();
            var dWeekDayOfMonthStart = new Date(dYear, dMonth, 0).getDay();
            var dLastDayOfMonth = new Date(dYear, dMonth + 1, 0).getDate();
           // var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 1, 0).getDate() - dWeekDayOfMonthStart + 1;
            var dLastDayOfPreviousMonth = new Date(dYear, dMonth + 0, 0).getDate() - dWeekDayOfMonthStart + 1;

            var cBody = $('<div/>').addClass('calendar__days');
            var cEvents = $('<div/>').addClass('calendar__events events');
            var cEventsBody = $('<div/>').addClass('calendar-events__body');
            var cDaysWrapper = $('<div/>').addClass('calendar__days-wrapper');
            //cEvents.append($('<div/>').addClass('calendar-events__title').html(settings.eventTitle));
            cEvents.append(cEventsBody);
            var cNext = $('<div/>').addClass('calendar__ctrl calendar__ctrl_next');
            var cMonth = $('<div/>').addClass('calendar__month');
            var cPrevious = $('<div/>').addClass('calendar__ctrl calendar__ctrl_prev');
            cPrevious.html(settings.textArrows.previous);
            cMonth.html(settings.months[dMonth] + ' ' + dYear);
            cNext.html(settings.textArrows.next);

            cMonth.on('click', calendarClickEvent);

            cPrevious.on('click', previousMonth);
            cNext.on('click', nextMonth);
            
            cBody.append(cPrevious);
            cBody.append(cMonth);
            cBody.append(cNext);
            for (var i = 0; i < settings.weekDays.length; i++) {
                var cWeekDay = $('<div/>').addClass('calendar__week-day');
                cWeekDay.html(settings.weekDays[i]);
                cBody.append(cWeekDay);
            }
            cBody.append(cDaysWrapper);
            var day = 1;
            var dayOfNextMonth = 1;
            for (var i = 0; i < 42; i++) {
                var cDay = $('<div/>');
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
                            cDay.on('click', mouseClickEvent);
                        }
                    }
                    cDay.html(day++);
                } else {
                    cDay.addClass('calendar__day calendar__day_next-month');
                    cDay.html(dayOfNextMonth++);
                }
                cDaysWrapper.append(cDay);
            }
            var eventList = $('<div/>').addClass('calendar-events__list');
            for (var i = 0; i < settings.events.length; i++) {
                var d = settings.events[i].datetime;
                if ((d.getMonth() - 1) == dMonth && d.getFullYear() == dYear) {
                    var date = lpad(d.getDate(), 2) + '/' + lpad(d.getMonth(), 2) + ' ' + lpad(d.getHours(), 2) + ':' + lpad(d.getMinutes(), 2);
                    var item = $('<div/>').addClass('calendar-events__i');
                    var link = settings.events[i].link;
                    var title = $('<div />').addClass('calendar-events__h')
                    var eventName = $('<a href="' + link + '" />').addClass('calendar-events__a').html(settings.events[i].title);
                    //var description = $('<div/>').addClass('calendar-events__description').html(settings.events[i].description + '<br/>');
                    var timeLabel = 'Время мероприятия: ';
                    var ageLabel = 'Ограничение по возрасту: ';
                    var minimumAge = $('<span/>').addClass('calendar-events__imp').html(settings.events[i].minimumAge);
                    var eventTime = $('<span/>').addClass('calendar-events__imp').html(settings.events[i].eventTime);
                    var property1 = $('<div/>').addClass('calendar-events__property').html(timeLabel);
                    var property2 = $('<div/>').addClass('calendar-events__property').html(ageLabel);

                    var eventDate = d.getDate();
                    var eventMonth = settings.months[dMonth];
                    var eventDateBlock = '<div class="calendar-events__date"><div class="calendar-events__number">' + eventDate + '</div><div class="calendar-events__weekday">' + eventMonth + '</div></div>';

                    console.log(eventDateBlock);

                    item.attr('data-event-day', d.getDate());
                    //item.on('mouseover', mouseOverItem).on('mouseleave', mouseLeaveItem);
                    //item.append(title).append(description);
                    property1.append(eventTime);
                    property2.append(minimumAge);
                    title.append(eventName)
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
        weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб','Вс'],
        months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        textArrows: {previous: '', next: ''},
        eventTitle: 'События',
        url: '',
        events: [
            {
                title: 'Концерт в Тюменской филармонии «Духового оркестра Югры»', 
                link: '#1',
                eventTime: '11:30', 
                minimumAge: '+18', 
                datetime: new Date(2015, 9, 6)
            },

            {
                title: 'КТЦ «Югра-Классик». «На страже мира»', 
                link: '#3', 
                eventTime: '15:00', 
                minimumAge: '+12', 
                datetime: new Date(2015, 10, 15)
            },
            {
                title: 'Концерт в Тюменской филармонии «Духового оркестра Югры»', 
                link: '#5', 
                eventTime: '19:55', 
                minimumAge: '+16', 
                datetime: new Date(2015, 10, 17)
            },
            {
                title: 'Открытие концертного сезона 2015-2016 в концертном зале', 
                link: '#2', 
                eventTime: '09:00', 
                minimumAge: '+18', 
                datetime: new Date(2015, 10, 26)
            },
            {
                title: 'КТЦ «Югра-Классик». Праздничный концерт к 70 летию Великой Победы', 
                link: '#4', 
                eventTime: '11:30', 
                minimumAge: '+16', 
                datetime: new Date(2015, 10, 26)
            },
            {
                title: 'КТЦ «Югра-Классик». Праздничный концерт к 70 летию Великой Победы', 
                link: '#4', 
                eventTime: '13:45', 
                minimumAge: '+16', 
                datetime: new Date(2015, 11, 21)
            },
            {
                title: 'Концерт в Тюменской филармонии «Духового оркестра Югры»', 
                link: '#5', 
                eventTime: '15:30', 
                minimumAge: '+16', 
                datetime: new Date(2015, 12, 6)
            }
        ]
    };

}(jQuery));