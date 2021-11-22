// When the page will load this function will make two tags and append that in title container.
window.addEventListener("load", function() {
    let minMaxContainer = document.getElementById("inner-icons1");   //tag with inner-icons1 id is loaded in minMaxContainer variable
    let iconType = document.createElement("i");  //i tag is created
    iconType.classList.add("fa","fa-window-minimize");   //icon from font awesome is added in i tag
    minMaxContainer.appendChild(iconType);  //appended in the inner-icons1 id

    let leftRightContainer = document.getElementById('inner-icons2');  //tag with inner-icons2 id is loaded in minMaxContainer variable
    let rotateIconType = document.createElement("i");       //i tag is created
    rotateIconType.classList.add("fa","fa-arrow-left");     //icon from font awesome is added in i tag
    leftRightContainer.appendChild(rotateIconType);         //appended in the inner-icons2 id
    getCountry();
});
//for minimising and maximising back to normal form
document.getElementById("inner-icons1").addEventListener("click",function()
{
    let minMaxContainer = document.getElementById("inner-icons1");
    let minimizeIcon = document.querySelectorAll(".fa-window-minimize");
    let iconType = document.createElement("i");
    // If the widget is minimised form then there will be no minimised tag so it will run if condition and shows icon for maximising 
    if(minimizeIcon && minimizeIcon.length === 0){ 
        let maximizeIcon = document.querySelectorAll(".fa-window-maximize");
        minMaxContainer.removeChild(maximizeIcon[0]);
        iconType.classList.add("fa","fa-window-minimize");
        document.querySelector('.widget-content').style.visibility = "visible";
        document.querySelector('#locations-widget-container').style.height = "50rem";
    }
    // If the widget is maximised form then there will be no maximised tag so it will run else condition and shows icon for minimising 
    else {
        minMaxContainer.removeChild(minimizeIcon[0]);
        iconType.classList.add("fa","fa-window-maximize");
        document.querySelector('.widget-content').style.visibility = "hidden";
        document.querySelector('#locations-widget-container').style.height = "5rem";
    }
    minMaxContainer.appendChild(iconType);
});

document.getElementById("inner-icons2").addEventListener("click",function()
{
    let leftRightContainer = document.getElementById("inner-icons2");
    let leftIcon = document.querySelectorAll(".fa-arrow-left");
    let iconType = document.createElement("i");
    // If the widget is collapsed and rotated then there will be no tag so it will run if condition and shows icon for rotating it to normal form
    if(leftIcon && leftIcon.length === 0){
        let rightIcon = document.querySelectorAll(".fa-arrow-right");
        leftRightContainer.removeChild(rightIcon[0]);
        iconType.classList.add("fa","fa-arrow-left");
        document.querySelector('.widget-content').style.visibility = "visible";
        document.querySelector('#locations-widget-container').style.height = "50rem";
        document.querySelector('#locations-widget-container').style.width = "40rem";
        document.getElementById('inner-icons1').style.display = "block";
        document.getElementById("locations-widget-container").style.transform = "rotate(-360deg)";
    }
    // If the widget is in normal form then else condition will run and shows icon for rotating it by 90 degree and in collapsed form. 
    else {
        leftRightContainer.removeChild(leftIcon[0]);
        iconType.classList.add("fa","fa-arrow-right");
        iconType.style.transform = "rotate(-270deg)";
        document.querySelector('.widget-content').style.visibility = "hidden";
        document.getElementById('inner-icons1').style.display = "none";
        document.querySelector('#locations-widget-container').style.height = "5rem";
        document.querySelector('#locations-widget-container').style.width = "20rem";
        document.getElementById("locations-widget-container").style.transform = "rotate(-90deg)";
    }
    leftRightContainer.appendChild(iconType);
});

async function updateIndex(data) {
    let flags = JSON.parse(localStorage.getItem('flags'));
    let x=document.getElementsByClassName("country-container")[0];   //it stores city-country data
    let y = document.getElementsByClassName("dict")[0];  //it stores country and flag URL
    let k = "";
    // This loop will add the tag in list container with the list of flag ang its city and country
    y.innerHTML = "";
    x.innerHTML = "";
    let checkBox = JSON.parse(localStorage.getItem('checkboxList'))
    for(let i in data )
    {
        let countryName = data[i].split('-')[1].trim();
        let flagIcon = flags[countryName];

        if(k !== data[i][0].toUpperCase()){
            if(checkBox.includes(data[i]))
            {
                x.innerHTML += `<div class="list" id = "${data[i][0].toUpperCase()}">
            <input checked type="checkbox" class="items" id = "${data[i]}">
            <img src="${flagIcon}" class="flag-icon" />
            <label class="elli" for="${data[i]}">${data[i]}</label>
        </div>`;
            }
            else{
                x.innerHTML += `<div class="list" id = "${data[i][0].toUpperCase()}">
                <input type="checkbox" class="items" id = "${data[i]}">
                <img src="${flagIcon}" class="flag-icon" />
                <label class="elli" for="${data[i]}">${data[i]}</label>
            </div>`;
            }
            
            k = data[i][0].toUpperCase();
            y.innerHTML += `<a class="marker" href="#${k}">${k}</a>`
        }
        else {
            if(checkBox.includes(data[i])){
                x.innerHTML+=`<div class="list">
            <input checked type="checkbox" class="items" id = "${data[i]}">
            <img src="${flagIcon}" class="flag-icon" />
            <label title="${data[i]}" class="elli" for="${data[i]}">${data[i]}</label>
        </div>`;
            }
            else{
                x.innerHTML+=`<div class="list">
                <input type="checkbox" class="items" id = "${data[i]}">
                <img src="${flagIcon}" class="flag-icon" />
                <label title="${data[i]}" class="elli" for="${data[i]}">${data[i]}</label>
            </div>`;
            }
            
        }
    }
    let checkboxes = document.getElementsByClassName('items');
    for(let i = 0; i < checkboxes.length; i++){
        checkboxes.item(i).addEventListener('change',function(){
            // console.log('hello')
            let checkboxList = JSON.parse(localStorage.getItem('checkboxList'));
            if(this.checked){
                checkboxList.push(this.id);
            } else {
                checkboxList = checkboxList.filter(id => this.id !== id);
            }
            localStorage.setItem('checkboxList',JSON.stringify(checkboxList));
        });
    }
}

async function getCountry(){
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    //local storage
    let completeData;
    if(localStorage.getItem('country')){
        completeData = JSON.parse(localStorage.getItem('country'));
    } else {
        //  this will fetch city-country api from the getpostman site
        let response = await fetch("https://countriesnow.space/api/v0.1/countries", requestOptions);
        response = await response.json()
        let data = [];// data of city-country is added in the list named as data
        for(let i in response.data)
        {
            for(let k in response.data[i].cities)
            {
                // adding only that data in list which starts with alphabet.
                if(response.data[i].cities[k][0].toLowerCase() >= "a" && response.data[i].cities[k][0].toLowerCase() <= "z")
                {
                    data.push(`${response.data[i].cities[k]} - ${response.data[i].country}`)
                }
                // we are taking only one city for each country just to load it fast
                if(k == 0)
                {
                    break;
                }
            }
        }
        data.sort();
        completeData = data;
        localStorage.setItem('country', JSON.stringify(completeData));
    }
    if(!localStorage.getItem('flags')){
        //  this will fetch flag api from the getpostman site
        // it will take some time to fetch so await function is used so that it will wait here only until fetching gets complete
        let flagResponse = await fetch("https://countriesnow.space/api/v0.1/countries/flag/images", requestOptions);
        flagResponse = await flagResponse.json();
        flagIcons = flagResponse.data;    //whole data is fetched in flagIcons.
        let flags = {};  //country name and flag url is stored in the form dictionary
        flagIcons.forEach(function(obj) {
            flags[obj.name] = obj.flag;
        });
        localStorage.setItem('flags', JSON.stringify(flags));
    }
    updateIndex(completeData);
    let checkboxes = document.getElementsByClassName('items');
    if(!localStorage.getItem('checkboxList')){
        localStorage.setItem('checkboxList', '[]');
    }
    for(let i = 0; i < checkboxes.length; i++){
        checkboxes.item(i).addEventListener('change',function(){
            // console.log('hello')
            let checkboxList = JSON.parse(localStorage.getItem('checkboxList'));
            if(this.checked){
                checkboxList.push(this.id);
            } else {
                checkboxList = checkboxList.filter(id => this.id !== id);
            }
            localStorage.setItem('checkboxList',JSON.stringify(checkboxList));
        });
    }
}
// with json.parse it becomes javascript object
function search() 
{
    let input, filter, li, i, txtValue;
    input = document.getElementById("searchInput"); 
    filter = input.value.toUpperCase();  //load the text which is written on the input area
    li = JSON.parse(localStorage.getItem('country')); //it will load the whole list of city-country
    let temp = [];
    for (let i = 0; i< li.length; i++)
    {
        txtValue = li[i];
        if(txtValue.toUpperCase().indexOf(filter) > -1)
        {
            temp.push(txtValue)
        }
    }
    //here it is checking input value with each data in the list 
    //if that matches it will show those results only others display gets none.
    //it stores city-country data

    updateIndex(temp);
}
// it will clear all the checkbox if they are checked
function clearall()
{
    list=document.getElementsByClassName("items");
    for(i=0;i<list.length;i++)
    {
        list[i].checked = false;
    }
    localStorage.setItem('checkboxList','[]');
}