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
    document.querySelector("#uf").addEventListener('change', function() {
        let idUF = document.querySelector('#uf').value;
        listaCidadesPorUF(idUF);
    });

    document.querySelector('#btn').addEventListener('click', function() {
        let ufValue = document.querySelector('#uf').value;
        let cidade = document.querySelector('#cidade').value;
        let logradouro = document.querySelector('#logradouro').value;
        document.querySelector('#mensagem').innerHTML = "";
        if (ufValue == '#' || logradouro == '' || cidade == '#') {
            let alert = document.createElement('div');
            alert.className = 'alert alert-danger';
            alert.role = 'alert';
            alert.innerHTML = 'Preencha os três campos para realizar a pesquisa! :-)';
            document.querySelector('#mensagem').appendChild(alert);
        } else {
            ufList.forEach(uf => {
                if(uf.id == ufValue) sigla = uf.sigla; 
            });
    
            buscaCEP(sigla, cidade, logradouro);
        }  
    });

    function buscaCEP(uf,cidade,logradouro) {
        if (logradouro.length < 3) {
            let msgWarning = document.createElement('div');
                msgWarning.className = 'bg-warning pt-2 text-white d-flex justify-content-center mb-2';
                msgWarning.innerHTML = '<h5> Para consultar o CEP insira 3 ou mais caracteres!</h5>';
                document.querySelector('#containerDinamico').appendChild(msgWarning);
                finalizaConsulta();
        }
        let url = "https://viacep.com.br/ws/" + uf + "/"+ cidade +"/" + logradouro + "/json/"; 
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', url);
        console.log(url);
        console.log(xmlHttp);
        xmlHttp.onreadystatechange = () => {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                let txtEndereco = xmlHttp.responseText;
                let jsonEndereco = JSON.parse(txtEndereco);
                if (jsonEndereco.length > 1) { 
                    let msgSelect = document.createElement('div');
                    msgSelect.className = 'bg-success pt-2 text-white d-flex justify-content-center mb-2';
                    msgSelect.innerHTML = '<h5> Selecione uma opção de endereço abaixo: </h5>';
                    let novoSelect = document.createElement('select');
                    novoSelect.id = 'optsendereco';
                    novoSelect.className = 'form-control mb-2 custom-select';
                    document.querySelector('#containerDinamico').appendChild(msgSelect);
                    document.querySelector('#containerDinamico').appendChild(novoSelect);
                    jsonEndereco.forEach(endereco => {
                        let opt = endereco.logradouro + " " + endereco.complemento;
                        option = new Option(opt, endereco.cep);
                        novoSelect.options[novoSelect.options.length] = option;
                    });

                    novoSelect.addEventListener('change', function() {
                        exibirCep(novoSelect.value);
                        finalizaConsulta();
                        novoSelect.setAttribute('disabled', 'disabled');
                    });
                
                }else {
                    if(jsonEndereco.length == 0) {
                        let msgWarning = document.createElement('div');
                        msgWarning.className = 'bg-warning pt-2 text-white d-flex justify-content-center mb-2';
                        msgWarning.innerHTML = '<h5> CEP não encontrado, verifique se você digitou um endereço válido!</h5>';
                        document.querySelector('#containerDinamico').appendChild(msgWarning);
                        finalizaConsulta();
                    }else {
                        exibirCep(jsonEndereco[0].cep);
                        finalizaConsulta();
                    }
                    
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
                let municipiosList = jsonMunicipios;
                let municipiosSelect = document.querySelector('#cidade');
        
                if (!municipiosSelect.options[1]) {
                    municipiosList.forEach((municipio) => {
                        option = new Option(municipio.nome, municipio.nome.toLowerCase());
                        municipiosSelect.options[municipiosSelect.options.length] = option;
                    });
                } else {                     
                    municipiosSelect.innerHTML = "";
                    municipiosList.forEach((municipio) => {
                        option = new Option(municipio.nome, municipio.nome.toLowerCase());
                        municipiosSelect.options[municipiosSelect.options.length] = option;
                    });
                } 
                
                                   
            }
        }
        xmlHttp.send();
    }
    
    function exibirCep(cep) {
        let btnCopiar = criarLinkCopiar();
        let resultado = document.createElement('input');
        resultado.type = 'text';
        resultado.id = 'resultado';
        resultado.className = 'form-control mb-2';
        resultado.setAttribute('readonly', 'readonly');
        resultado.value = cep;
        document.querySelector('#resultadoCEP').appendChild(resultado);
        document.querySelector('#botaoCopia').appendChild(btnCopiar);

        document.querySelector('#copiar').addEventListener('click', function () {
           resultado.select();
           document.execCommand('copy');
        });
    }
    
    function finalizaConsulta() {
        document.querySelector('#btn').setAttribute("disabled", "disabled");
        document.querySelector('#logradouro').setAttribute("disabled", "disabled");
        document.querySelector('#uf').setAttribute("disabled", "disabled");
        document.querySelector('#cidade').setAttribute("disabled", "disabled");
        let btnNovaConsulta = document.createElement('button');
        btnNovaConsulta.id = 'btnnovaconsulta';
        btnNovaConsulta.className = 'btn btn-danger btn-lg btn-block mt-2';
        btnNovaConsulta.innerHTML = 'Nova Consulta';
        document.querySelector('#containerBotoes').appendChild(btnNovaConsulta);

        btnNovaConsulta.addEventListener('click', function () {
           document.location.reload(); 
        });
    }

    function criarLinkCopiar() {
        let btnCopiar = document.createElement('a');
        btnCopiar.id = 'copiar';
        btnCopiar.innerHTML = 'Copiar';
        btnCopiar.className = 'btn btn-success text-white text-center';
        return btnCopiar;
    }
})

// resolver problema quando retorna array vazio na consulta