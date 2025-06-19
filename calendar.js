function renderCalendar(year, month) {
    const calendarSection = document.getElementById('calendar-section');
    calendarSection.innerHTML = '';//カレンダー描画するところをいったん空に
  
    const rawData = JSON.parse(localStorage.getItem('emotionLogs')) || {};

    const storedData = {};//さっきのstoredDataとはちがう．入れるための配列
    Object.keys(rawData).forEach(dateKey => {//でーたの配列すべてに以下の処理を加える
      const v = rawData[dateKey];
      if (typeof v === 'string') {//コメントもあるver  以前はコメント機能なかった
        storedData[dateKey] = { value: v, comment: '' };
      } else {
        storedData[dateKey] = v;
      }
    });
 
    /*テーブルの土台を生成*/
    const table = document.createElement('table');//テーブル作成
    table.classList.add('calendar-table');//さっきのテーブルにcssのcalendar-tableを反映
  
    /*曜日ヘッダー作成*/
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['日','月','火','水','木','金','土'].forEach((weekday,index) => {//曜日とindex数字をセットで
      const th = document.createElement('th');
      th.textContent = weekday;//thのtextcontent=曜日

      if(index===0){
        th.classList.add('sunday');//cssの赤を充てる
      }else if(index===6){
        th.classList.add('saturday');
      }
      headerRow.appendChild(th); //headerRowにth追加7回→ヘッダーの曜日
    });
    thead.appendChild(headerRow);//theadにheaderRowの7masu追加
    table.appendChild(thead);
  
    const tbody = document.createElement('tbody');
    const firstDay = new Date(year, month - 1, 1);
    const lastDay  = new Date(year, month, 0).getDate();
    const startWeekday = firstDay.getDay();//月の最初の曜日を代入
    let currentDay = 1;
    const rowCount = Math.ceil((startWeekday + lastDay) / 7);//月の行数計算
  
    for (let i = 0; i < rowCount; i++) {
      const tr = document.createElement('tr');　//横七個作る
      for (let w = 0; w < 7; w++) {
        const td = document.createElement('td');
  
        if ((i === 0 && w < startWeekday) || currentDay > lastDay) {//からんだーの最初と最後空白処理
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
  
        const entry = storedData[dayString] || {};//entryにデータを代入
  
        /* 色塗り*/
        if (entry.value) {
          td.style.backgroundColor = colorMap[entry.value] || 'transparent';
        }
  
        /*今日枠*/
        if (dayString === getToday()) {
          td.classList.add('today');//今日のマスtdにcssのtodayを適用
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
          Object.keys(allRaw).forEach(k => {//コメントがあるときない時の
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
          renderCalendar(currentYear, currentMonth);//すぐ再描画することで即座に変更が反映
        });
  
        currentDay++;
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
  
    table.appendChild(tbody);//table<-tbody
    calendarSection.appendChild(table);
}

function showPrevMonth(){
    currentMonth--;
    if(currentMonth===0){
        currentMonth=12;
        currentYear--;
    }
    renderCalendar(currentYear,currentMonth);
    updateMonthLabel();//カレンダーの上の奴書き換え
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