$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
  });;
  $(function () {
    var showClass = 'show';

    $('input').on('checkval', function () {
      var label = $(this).prev('label');
      if(this.value !== '') {
        label.addClass(showClass);
      } else {
        label.removeClass(showClass);
      }
    }).on('keyup', function () {
      $(this).trigger('checkval');
    });
  });


  $( function() {
    $( "#accordion" ).accordion({
      header: '.todo-list-item-header',
      collapsible: true,
      active: false
    }).sortable({
        axis: "y",
        handle: "div",
        stop: function( event, ui ) {
          // IE doesn't register the blur when sorting
          // so trigger focusout handlers to remove .ui-state-focus
          div.item.children( "div" ).triggerHandler( "focusout" );
          // Refresh accordion to handle new order
          $( this ).accordion( "refresh" );
        }
      });;
    $('.todo-list-item-header').on( "click", 'input[type="checkbox"]', function(e) {
      e.stopPropagation();
      $(this).parent().parent().fadeOut();
    });
  } );
});
