document.addEventListener('DOMContentLoaded', function() {
    //Lista com os estados
    const ufList = ["AC", "AL", "AP", "AM", "BA", "CE",
                    "DF", "ES", "GO", "MA", "MT", "MS",
                    "MG", "PA", "PB", "PR", "PE", "PI",
                    "RJ", "RN", "RS", "RO", "RR", "SC",
                    "SP", "SE", "TO"
                   ]
    
                   
    const ufSelect = document.getElementById("uf");

    ufList.forEach((uf) => {
        option = new Option(uf, uf.toLowerCase());
        ufSelect.options[ufSelect.options.length] = option;
    });

    document.querySelector('#btn').addEventListener('click', function() {
        let uf = document.querySelector('#uf').value;
        let cidade = document.querySelector('#cidade').value;
        let logradouro = document.querySelector('#logradouro').value;

        document.querySelector('#resultado').value = buscaCEP(uf, cidade, logradouro);
    })

    function buscaCEP(uf,cidade,logradouro) {
        let url = "https://viacep.com.br/ws/" + uf + "/"+ cidade +"/" + logradouro + "/json/"; 
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', url);
        //console.log(xmlHttp);
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                let txtEndereco = xmlHttp.responseText;
                let jsonEndereco = JSON.parse(txtEndereco);
                //console.log(jsonEndereco);
                if (jsonEndereco.length > 1) { //continue
                    document.querySelector('#resultado').value = "Mais de um registro encontrado!";
                    alert('Mais de um registro encontrado! Coloque o nome completo do logradouro e da cidade, para evitar conflitos.');
                }else {
                    document.querySelector('#resultado').value = jsonEndereco[0].cep; 
                }
                
            }
        }

        xmlHttp.send();
    }
})

//continue no select