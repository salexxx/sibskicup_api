var register = function(Handlebars) {
    var helpers = {
      // put all of your helpers inside this object
      protocol: function(){
         var protocol = ''  
            this.forEach(el => {
            protocol += '<tr> <td>' + el.num + '</td><th>'+el.rank+'</th> <th> <a href="/athlete/'+el.man_id+'">'+el.f_name +' '+el.name+ '</a></th>  <td>'+el.age +'</td>      <td>'+el.city+ '</td>          <td>'+el.f_pop+'</td>        <td>'+el.s_pop+'</td>      <td>'+el.summ+'</td>         <td>'+el.ochki+'</td>         </tr>'
    
        });
        return protocol
            },
        dnf: function(){
                var protocol = ''  
                   this.forEach(el => {
                   protocol += '<tr> <td>' + el.num + '</td><th></th> <th> <a href="/athlete/'+el.man_id+'">'+el.f_name +' '+el.name+ '</a></th>  <td>'+el.age +'</td>      <td>'+el.city+ '</td>          <td>'+el.f_pop+'</td>        <td>'+el.s_pop+'</td>      <td></td>         <td></td>         </tr>'
           
               });
               return protocol
                   },
   
    };
  
    if (Handlebars && typeof Handlebars.registerHelper === "function") {
      // register helpers
      for (var prop in helpers) {
          Handlebars.registerHelper(prop, helpers[prop]);
      }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }
  
  };
  
  module.exports.register = register;
  module.exports.helpers = register(null);    