// Connexion à socket.io
const socket = io.connect('http://localhost:3000');
// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
const username = prompt('Quel est votre pseudo ?');
$('#header').prepend('Bonjour ' + username + ' !');
discussion_id = socket.id;
socket.emit('admin', username, discussion_id);

document.title = username + ' - ' + document.title;
// Quand on reçoit un message, on l'insère dans la page
socket.on("message", function(data) {
    insereMessage(data.username, data.message)
})
// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaire_chat').submit(function () {
    const message = $('#message').val();
    socket.emit("message", message); // Transmet le message aux autres
    insereMessage(username, message); // Affiche le message aussi sur notre page
    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    return false; // Permet de bloquer l'envoi "classique" du formulaire
});
// Ajoute un message dans la page
function insereMessage(username, message) {
    $('#zone_chat').prepend('<p><strong>' + username + '</strong> ' + message + '</p>');
}