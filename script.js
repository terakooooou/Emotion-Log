let currentYear;
let currentMonth;



window.addEventListener('DOMContentLoaded',()=>{
    const ratingButtons=document.querySelectorAll('#rating-section button');

    ratingButtons.forEach((button)=>{
        button.addEventListener('click',()=>{
            const value=button.getAttribute('data-value');
            const today=getToday();
    
            const storedData=JSON.parse(localStorage.getItem('emotionLogs'))||{};
            storedData[today]=value;

            localStorage.setItem('emotionLogs',JSON.stringify(storedData));

            console.log(today+"の評価を"+value+"に設定しました！");

            const now= new Date();
            currentYear=now.getFullYear();
            currentMonth=now.getMonth()+1;

            renderCalendar(currentYear,currentMonth);

            document.getElementById('prev-btn').addEventListener('click',showPrevMonth);
            document.getElementById('next-btn').addEventListener('click',showNextMonth);

            updateMonthLabel();

        })
    })

    const now= new Date();
    currentYear=now.getFullYear();
    currentMonth=now.getMonth()+1;

    updateMonthLabel();

    renderCalendar(currentYear,currentMonth);
    
});

const colorMap={
    '1':'red',
    '2':'orange',
    '3':'yellow',
    '4':'lightgreen',
    '5':'hsl(120,100%,50%)',
}


function getToday(){
    const now=new Date();
    const year=now.getFullYear();

    const month=String(now.getMonth()+1).padStart(2,'0');
    const day=String(now.getDate()).padStart(2,'0');

    return year + '-' + month + '-' + day;
}

function renderCalendar(year,month){
    const calendarSection=document.getElementById('calendar-section');
    calendarSection.innerHTML='';

    const storedData=JSON.parse(localStorage.getItem('emotionLogs'))||{};

    const table=document.createElement('table');
    table.classList.add('calendar-table');

    const thead=document.createElement('thead');
    const headerRow=document.createElement('tr');
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

    weekdays.forEach(weekday=>{
        const th=document.createElement('th');
        th.textContent=weekday;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody=document.createElement('tbody');

    const firstDay=new Date(year,month-1,1);
    const lastDay=new Date(year,month,0).getDate();
    const startWeekday=firstDay.getDay();

    let currentDay=1;

    const rowCount=Math.ceil((startWeekday+lastDay)/7);

    for(let i=0;i<rowCount;i++){
        const tr=document.createElement('tr');
        
        for(let w=0;w<7;w++){
            const td=document.createElement('td');
            
            if((i===0&&w<startWeekday)||currentDay>lastDay){
                td.textContent='';
                tr.appendChild(td);
                continue;
            }

            td.textContent=currentDay;

            const dayString = `${year}-${String(month).padStart(2, '0')}-${String(currentDay).padStart(2, '0')}`;

            if(storedData[dayString]){
                const value=storedData[dayString];
                td.style.backgroundColor=colorMap[value]||'transparent';
            }

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