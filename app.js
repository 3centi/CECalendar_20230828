const weeks = ['日', '月', '火', '水', '木', '金', '土'];
const months_English = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;

const old_enperor_birthday = new Date(year,11,23); //旧天皇誕生日
const old_enperor_birthday_month = old_enperor_birthday.getMonth();
const old_enperor_birthday_date = old_enperor_birthday.getDate();

const new_enperor_birthday = new Date(year,1,23); //新天皇誕生日
const new_enperor_birthday_month = new_enperor_birthday.getMonth();
const new_enperor_birthday_date = new_enperor_birthday.getDate();

let showCalendar = (year,month) => {
    for ( i = 0; i < 3; i++) {
        const calendarHtml = createCalendars(year, month);
        const sec = document.createElement('section');
        sec.innerHTML = calendarHtml;
        document.querySelector('#calendar').appendChild(sec);

        month++;
        if (month > 12) {
            year++;
            month = 1;
        }
    }
}

let createCalendar = (year, month) =>{
    const startDate = new Date(year, month - 1, 1); // 月の最初の日を取得
    const endDate = new Date(year, month,  0); // 月の最後の日を取得
    const endDayCount = endDate.getDate(); // 月の末日
    const lastMonthEndDate = new Date(year, month - 2, 0); // 前月の最後の日の情報
    const lastMonthendDayCount = lastMonthEndDate.getDate(); // 前月の末日
    const startDay = startDate.getDay(); // 月の最初の日の曜日を取得
    let dayCount = 1; // 日にちのカウント
    let calendarHtml = ''; // HTMLを組み立てる変数

    let is_nationalHoliday = ''; //祝日かどうか判定する変数(str)

    let month_English = months_English[month-1];

    calendarHtml += '<div><table class="radius-table"><tbody><tr><th colspan="2"></th>'; //monthの左側の余白
    calendarHtml += '<th colspan="3"><div class="month">'+ year + ' ' + month_English + ' ' + String(month) +'</div></th>';
    calendarHtml += '<th colspan="2"></th></tr>'; //monthの右側の余白

    // 曜日の行を作成
    for (let i = 0; i < weeks.length; i++) {
        calendarHtml += '<td class="daysOfWeek">' + weeks[i] + '</td>';
    }

    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>';

        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                // 1行目で1日の曜日の前
                let num = lastMonthendDayCount - startDay + d + 1;
                calendarHtml += '<td><div class="day is-disabled">' + num + '</div></td>';
            } else if (dayCount > endDayCount) {
                // 末尾の日数を超えた
                let num = dayCount - endDayCount;
                calendarHtml += '<td><div class="day is-disabled">' + num + '</div></td>';
                dayCount++;
            } else {
                day = new Date(year, month - 1, dayCount);
                is_nationalHoliday = JapaneseHolidays.isHoliday(day);

                //祝日の参照元データだと天皇誕生日が古いままなので新しい方に対応させる.
                if(month == old_enperor_birthday_month + 1 && dayCount == old_enperor_birthday_date){
                    is_nationalHoliday = '';
                }else if(month == new_enperor_birthday_month + 1 && dayCount == new_enperor_birthday_date){
                    is_nationalHoliday = '天皇誕生日';
                }

                if(d == 0 || is_nationalHoliday){
                    //日曜日と祝日
                    calendarHtml += `<td data-date="${year}/${month}/${dayCount}"><div class="day holiday" style="background-color: pink;">${dayCount}</div></td>`
                }else if(d == 1){
                    //月曜日
                    calendarHtml += `<td data-date="${year}/${month}/${dayCount}"><div class="day notHoliday" style="background-color: pink;">${dayCount}</div></td>`
                }else{
                    //火曜~土曜
                    calendarHtml += `<td data-date="${year}/${month}/${dayCount}"><div class="day notHoliday" style="background-color: lightskyblue;">${dayCount}</div></td>`
                }
                dayCount++;
            }
        }
        calendarHtml += '</tr>';
    }
    calendarHtml += '</tbody></table></div>';
    return calendarHtml;
};

let createCalendars = (year,month) =>{

    let calendarHtml = ''; // HTMLを組み立てる変数

    calendarHtml += '<div class="calendars">';
    calendarHtml += createCalendar(year,month);

    month += 3;
    if(month>12){
        month -= 12;
    }
    calendarHtml += createCalendar(year,month);
    calendarHtml += '</div>';

    return calendarHtml;
};

//上のボタンを押すと1ヶ月前や後に変える機能の関数
let moveCalendar = (e) => {
    document.querySelector('#calendar').innerHTML = '';

    if (e.target.id === 'prev') {
        month--;
        if (month < 1) {
            year--;
            month = 12;
        }
    }

    if (e.target.id === 'next') {
        month++;
        if (month > 12) {
            year++;
            month = 1;
        }
    }

    showCalendar(year, month);
};

document.querySelector('#prev').addEventListener('click', moveCalendar);
document.querySelector('#next').addEventListener('click', moveCalendar);

//クリックでセルの色を変更させる
document.addEventListener("click", (e) => {
    if(e.target.classList.contains("day")) {
        let cellColor = e.target.style.backgroundColor; //セルの色を取得
        if(cellColor == 'pink' || cellColor == 'yellow' || cellColor == 'lightskyblue'){
            if(cellColor == 'pink'){
                e.target.style.backgroundColor = 'lightskyblue'; //セルの色がピンクなら、クリックで空色に変更
            }else if(cellColor == 'lightskyblue'){
                e.target.style.backgroundColor = 'yellow';  //セルの色が空色なら、クリックで黄色に変更
            }else{
                e.target.style.backgroundColor = 'pink'; //セルの色が黄色なら、クリックでピンクに変更
            }
        }
    }
})

showCalendar(year, month);