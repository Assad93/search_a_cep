document.addEventListener('DOMContentLoaded', function() {
    //Lista com os estados e os respectivos ID´s do IBGE
    const ufList = [{"id" : 12 , "sigla" : "AC"}, {"id" : 27 , "sigla" : "AL"}, {"id" : 16 , "sigla" : "AP"}, 
                    {"id" : 13 , "sigla" : "AM"}, {"id" : 29 , "sigla" : "BA"}, {"id" : 23 , "sigla" : "CE"},
                    {"id" : 53 , "sigla" : "DF"}, {"id" : 32 , "sigla" : "ES"}, {"id" : 52 , "sigla" : "GO"},
                    {"id" : 21 , "sigla" : "MA"}, {"id" : 51 , "sigla" : "MT"}, {"id" : 50 , "sigla" : "MS"},
                    {"id" : 31 , "sigla" : "MG"}, {"id" : 15 , "sigla" : "PA"}, {"id" : 25 , "sigla" : "PB"},
                    {"id" : 41 , "sigla" : "PR"}, {"id" : 26 , "sigla" : "PE"}, {"id" : 22 , "sigla" : "PI"},
                    {"id" : 33 , "sigla" : "RJ"}, {"id" : 24 , "sigla" : "RN"}, {"id" : 43 , "sigla" : "RS"},
                    {"id" : 11 , "sigla" : "RO"}, {"id" : 14 , "sigla" : "RR"}, {"id" : 42 , "sigla" : "SC"},
                    {"id" : 35 , "sigla" : "SP"}, {"id" : 28 , "sigla" : "SE"}, {"id" : 17 , "sigla" : "TO"}
                   ]
    
    //capturando o select de UF´s               
    const ufSelect = document.getElementById("uf");
    //Preenchendo o select de UF´s               
    ufList.forEach((uf) => {
        option = new Option(uf.sigla, uf.id);
        ufSelect.options[ufSelect.options.length] = option;
    });

    //capturando o select de Cidades
    const cidadesSelect = document.querySelector("#cidade");
    //Preenchendo o select de Cidades
    document.querySelector("#uf").addEventListener('blur', function() {
        let idUF = document.querySelector('#uf').value;
        console.log(idUF);
        listaCidadesPorUF(idUF);
        // continue, tornar o select dinamico
    });

    document.querySelector('#btn').addEventListener('click', function() {
        let uf = document.querySelector('#uf').value;
        let cidade = document.querySelector('#cidade').value;
        let logradouro = document.querySelector('#logradouro').value;

        document.querySelector('#resultado').value = buscaCEP(uf, cidade, logradouro);
    });

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

    function listaCidadesPorUF(idUF) {
        let url = "https://servicodados.ibge.gov.br/api/v1/localidades/estados/"+ idUF +"/municipios";
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', url);
        xmlHttp.onreadystatechange = () => {
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                let txtMunicipios = xmlHttp.responseText;
                let jsonMunicipios = JSON.parse(txtMunicipios);
                console.log(jsonMunicipios);
                preencheOSelectComAsCidades(jsonMunicipios);                    
            }
        }
        xmlHttp.send();
    }

    function preencheOSelectComAsCidades(municipios) {
        let municipiosList = municipios;
        let municipiosSelect = document.querySelector('#cidade');

        municipiosList.forEach((municipio) => {
            option = new Option(municipio.nome, municipio.nome.toLowerCase());
            municipiosSelect.options[municipiosSelect.options.length] = option;
        });
    }
})
