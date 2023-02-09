
const URL = " https://metals-api.com/api/latest?access_key=gwsfjwyunwsi52ky0jd0shqfjr9mgyat24hx29tpyc21z7p42dwfi0fgq5p5&base=XAU&symbols=USD,CAD,EUR "

// XAU - Gold , XAG - Silver , EUR - Euro , USD - Dollars.
//Price is usd,eur is per 1oz of gold and XAG is for how many troy ounce of silver you need for 1 troy ounce of gold.
   
getCallApi();
async function getCallApi() {

    const result = await fetch(URL);

    result.json().then(json => {
        
        console.log(json);

    });
};
    
