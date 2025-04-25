let currentYear;
let currentMonth;

window.addEventListener('DOMContentLoaded',()=>{


  setTimeout(()=>{
    const title=document.getElementById('title-screen');
    title.classList.add('fade-out');

    setTimeout(()=>title.remove(),1000);
  },3000);

    const now= new Date();
    currentYear=now.getFullYear();
    currentMonth=now.getMonth()+1;

    document.getElementById('prev-btn').addEventListener('click',showPrevMonth);
    document.getElementById('next-btn').addEventListener('click',showNextMonth);

    const ratingButtons=document.querySelectorAll('#rating-section button');
    ratingButtons.forEach((button)=>{
        button.addEventListener('click',()=>{
            const value=button.getAttribute('data-value');
            const today=getToday();
    
            const storedData=JSON.parse(localStorage.getItem('emotionLogs'))||{};
            /*storedataは配列*/
            const existing=storedData[today]||{};
            
            if(existing.value===value){
                delete storedData[today];
            }else{
                storedData[today]={
                    value:value,
                    comment:existing.comment||""
                };
            }

            localStorage.setItem('emotionLogs',JSON.stringify(storedData));

            console.log(today+"の評価を"+value+"に設定しました！");
            renderCalendar(currentYear,currentMonth);
        })
    })
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
    if(now.getHours()<3){
      now.setDate(now.getDate()-1);
    }

    const year=now.getFullYear();
    const month=String(now.getMonth()+1).padStart(2,'0');
    const day=String(now.getDate()).padStart(2,'0');

    return year + '-' + month + '-' + day;
}
