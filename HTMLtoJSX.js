function convertHtmlToJsx(htmlStr) {
    let tempHtml = `${htmlStr}`
    function propertyToJsonProperty(property){
        let newProperty = ''
        if (property.includes('-')){
            let all = property.split('-')
            newProperty += all[0]
            newProperty += `${all[1][0].toUpperCase()}${all[1].slice(1)}`
        }
        else {
            return property
        }
        return newProperty
    }

    let arr = tempHtml.split("'")
    let prox = false
    for (let index = 0; index < arr.length; index++) {
        var cadena = arr[index];
        if (cadena.includes('style=')){
            prox = true
        }
        else if (prox == true){
            prox = false
            let newStyle = '{{'
            let propertys = cadena.split(';')
            for (let index = 0; index < propertys.length; index++) {
                var property = propertys[index];
                if (property == ''){
                    continue
                }
                let keyValue = property.replaceAll(' ','').split(':')
                let key = propertyToJsonProperty(keyValue[0])
                let value = keyValue[1]
                newStyle+=`${key}:'${value}',`
            }
            newStyle+='}}'
            arr[index] = newStyle
            htmlStr = htmlStr.replace(cadena,newStyle)
        }
    }
    return htmlStr.replaceAll(",}}'", "}}").replaceAll("'{{", "{{").replaceAll("class=","className=")
}

const htmlString = "<div style='height: 500px;width: 300px;display: flex;'><div style='font-size: 20px; background-color: red;'></div></div>";

console.log(convertHtmlToJsx(htmlString));  // <div style={{height:'500px',width:'300px',display:'flex'}}><div style={{fontSize:'20px',backgroundColor:'red'}}></div></div>