function renderCalendar(year, month) {
    const calendarSection = document.getElementById('calendar-section');
    calendarSection.innerHTML = '';
  
    const rawData = JSON.parse(localStorage.getItem('emotionLogs')) || {};

    const storedData = {};
    Object.keys(rawData).forEach(dateKey => {
      const v = rawData[dateKey];
      if (typeof v === 'string') {
       
        storedData[dateKey] = { value: v, comment: '' };
      } else {

        storedData[dateKey] = v;
      }
    });
 
    /*テーブルの土台を生成*/
    const table = document.createElement('table');
    table.classList.add('calendar-table');
  
    /*曜日ヘッダー作成*/
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['日','月','火','水','木','金','土'].forEach((weekday,index) => {
      const th = document.createElement('th');
      th.textContent = weekday;

      if(index===0){
        th.classList.add('sunday');
      }else if(index===6){
        th.classList.add('saturday');
      }
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
  
    const tbody = document.createElement('tbody');
    const firstDay = new Date(year, month - 1, 1);
    const lastDay  = new Date(year, month, 0).getDate();
    const startWeekday = firstDay.getDay();
    let currentDay = 1;
    const rowCount = Math.ceil((startWeekday + lastDay) / 7);
  
    for (let i = 0; i < rowCount; i++) {
      const tr = document.createElement('tr');
      for (let w = 0; w < 7; w++) {
        const td = document.createElement('td');
  
        if ((i === 0 && w < startWeekday) || currentDay > lastDay) {
          td.textContent = '';
          tr.appendChild(td);
          continue;
        }
  
        /*日付表示*/
        td.textContent = currentDay;

        const date = new Date(year, month - 1, currentDay);
        const weekdayIndex = date.getDay();

        // 曜日に応じてクラスを追加
        if (weekdayIndex === 0) {
            td.classList.add('sunday');
        } else if (weekdayIndex === 6) {
            td.classList.add('saturday');
        }

        const dayString = `${year}-${String(month).padStart(2,'0')}-${String(currentDay).padStart(2,'0')}`;
  
        const entry = storedData[dayString] || {};
  
        /* 色塗り*/
        if (entry.value) {
          td.style.backgroundColor = colorMap[entry.value] || 'transparent';
        }
  
        /*今日枠*/
        if (dayString === getToday()) {
          td.classList.add('today');
        }
  
        /*コメントマークつける*/ 
        if (entry.comment) {
          td.classList.add('has-comment');
          td.title = entry.comment;
        }
  
        /*コメント入力・編集*/
        td.addEventListener('click', () => {
          
          const allRaw = JSON.parse(localStorage.getItem('emotionLogs')) || {};
          const allData = {};
          Object.keys(allRaw).forEach(k => {
            const v2 = allRaw[k];
            allData[k] = typeof v2 === 'string' ? {value: v2, comment: ''} : v2;
          });
          const eNow = allData[dayString] || {value:'', comment:''};
  
          const newComment = prompt(
            'Enter comment(leave blank to delete)',
            eNow.comment
          );
          if (newComment === null) return;
  
          allData[dayString] = {
            value: eNow.value,
            comment: newComment.trim()
          };
          localStorage.setItem('emotionLogs', JSON.stringify(allData));
          renderCalendar(currentYear, currentMonth);
        });
  
        currentDay++;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  
    table.appendChild(tbody);
    calendarSection.appendChild(table);
}

function showPrevMonth(){
    currentMonth--;
    if(currentMonth===0){
        currentMonth=12;
        currentYear--;
    }
    renderCalendar(currentYear,currentMonth);
    updateMonthLabel();
}

function showNextMonth(){
    currentMonth++;
    if(currentMonth===13){
        currentMonth=1;
        currentYear++;
    }
    renderCalendar(currentYear,currentMonth);
    updateMonthLabel();
}

function updateMonthLabel(){
    const label=document.getElementById('month-label');
    label.textContent=`${currentYear}年${currentMonth}月`;
}