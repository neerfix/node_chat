// Connexion à socket.io
const socket = io.connect('http://localhost:3000');
const pseudo = 'Administrator';
socket.emit('admin', pseudo);
const link = document.querySelector('#openchat');
link.addEventListener('click', function () {
    const datadata = $(this).data('id');
    if(datadata === 1){
        $('#header').text("Tous les clients");
    }else{
        $('#header').text(username);
    }
    console.log(datadata);
    document.getElementById("formulaire_chat").removeAttribute('data-id');
    document.getElementById("formulaire_chat").setAttribute('data-id', datadata);
    document.getElementById("zone_chat").removeAttribute('data-id');
    document.getElementById("zone_chat").setAttribute('data-id', datadata);

    jQuery.ajax({url: "/api", success: function(result){
        for (let i = 0; i < result['discussion'].length; i++) {
            if(result['discussion'][i].id === datadata){
                for (let j = 0; j < result['messages'].length; j++) {
                    $("#zone_chat").html('');
                    if(result['messages'][i].discussion_id === datadata){
                        let message = result['messages'][i];
                        console.log(message);
                        $("#zone_chat").prepend('<div>'+ message.body +'</div>')
                    }else{
                        let message = '';
                        $("#zone_chat").prepend('<div>'+ message +'</div>')
                    }
                }
            }
        }
    }});
    return datadata;
});

// Quand un nouveau client se connecte, on affiche l'information
socket.on('admin', function(username, discussion_id) {
    $('#client').prepend('<li class="d-flex flex-row order-2" data-id="'+discussion_id+'" id="openchat"><div class="logged"></div> ' + username + '</li>');
    const link = document.querySelector('#openchat');
    link.addEventListener('click', function () {
        const datadata = $(this).data('id');
        if(datadata === 1){
            $('#header').text("Tous les clients");
        }else{
            $('#header').text(username);
        }
        document.getElementById("formulaire_chat").removeAttribute('data-id');
        document.getElementById("formulaire_chat").setAttribute('data-id', datadata);
        document.getElementById("zone_chat").removeAttribute('data-id');
        document.getElementById("zone_chat").setAttribute('data-id', datadata);

        jQuery.ajax({url: "/api", success: function(result){
                for (let i = 0; i < result['discussion'].length; i++) {
                    if(result['discussion'][i].id === datadata){
                        for (let j = 0; j < result['messages'].length; j++) {
                            $("#zone_chat").html('');
                            if(result['messages'][i].discussion_id === datadata){
                                let message = result['messages'][i];
                                console.log(message);
                                $("#zone_chat").prepend('<div>'+ message.body +'</div>')
                            }else{
                                let message = '';
                                $("#zone_chat").prepend('<div>'+ message +'</div>')
                            }
                        }
                    }
                }
            }});
        return datadata;
    });
});

// Quand un nouveau client se connecte, on affiche l'information
socket.on('admin', function(username) {
    if(document.getElementById('zone_chat').getAttribute('data-id') === '1'){
        $('#zone_chat').prepend('<p><em>' + username + ' a rejoint le Chat !</em></p>');
    }
})

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaire_chat').submit(function () {
    const datadata = document.getElementById('formulaire_chat').getAttribute("data-id");
    const message = $('#message').val();
    socket.emit('messages', message); // Transmet le message aux autres
    insereMessage('Administrator', message); // Affiche le message aussi sur notre page
    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    return false; // Permet de bloquer l'envoi "classique" du formulaire
});

// Ajoute un message dans la page
function insereMessage(username, message) {
    $('#zone_chat').prepend('<p><strong>' + username + '</strong> ' + message + '</p>');
}

// Quand on reçoit un message, on l'insère dans la page
socket.on('message', function(data){
        insereMessage(data.username, data.message)
})