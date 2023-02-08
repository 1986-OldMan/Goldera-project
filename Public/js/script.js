
const GoldProductArray = [

    "Gold" , "Gold coins" ,
    "Gold bars" , "PAMP" ,
    "Munze Osterreich" ,
    "Argor-Heraeus" , "Valcambi Suisse" ,
    "Rand Refinery" , "Perth Mint" ,
    "Maple Leaf 1oz" , "Vienna Philharmonic",
    "American Eagle" , "American Buffalo" , 
    "Britannia 1 oz" , "South African Mint"
];

const searchInput = document.querySelector(".searchInput");

const input = searchInput.querySelector("input");

const resultBox = searchInput.querySelector(".resultBox");

const icon = searchInput.querySelector(".icon");

let linkTag = searchInput.querySelector("a");

input.onkeyup = (click) => {

    let userData = click.target.value; 

    let emptyArray = [];

    if(userData){

        emptyArray = GoldProductArray.filter((data) => {
            
            return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase()); 
        });

        emptyArray = emptyArray.map((data)=>{
      
            return data = '<li>'+ data;
        });

        searchInput.classList.add("active"); 

        showSuggestions(emptyArray);

        let allList = resultBox.querySelectorAll("li");

        for (let i = 0; i < allList.length; i++) {
         
            allList[i].setAttribute("onclick", "select(this)");
        }

    } else {
        
        searchInput.classList.remove("active");
    }
}

function showSuggestions(list){

    let listData;

    if(!list.length){

        userValue = inputBox.value;

        listData = '<li>'+ userValue +'</li>';

    } else {

        listData = list.join('');
    }

    resultBox.innerHTML = listData;
}

