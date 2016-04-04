$(function(){
	var ListView = Backbone.View.extend({
		el: $('html'), // el attaches to existing element
		events: {
			'mouseenter .post-list-image': 'showCompleteImage',
			'click .opendialog ':'openDialog',
			'mouseenter .endorse-blog-button':'showEndorse',
			'mouseleave .endorse-blog-button':'hideEndorse'
		},
		initialize: function(){
			_.bindAll(this, 'render','loadCover','after_cover_process'); // every function that uses 'this' as the current object should be in here
			this.render();
		},
		render: function(){
			this.loadCover();
			this.configure_share();
		},
		loadCover:function(){
			var bbobj=this;
			if($("#blog-cover-img").length===0){
				bbobj.after_cover_process();
				return;
			}
			var url=$("#blog-cover-img").data("cover");
			$.ajax({
					url : url,
					cache: true,
					processData : false,
					timeout:60000,
			}).success(function(){
				$("#blog-cover-bg").css("background-image",'url('+url+')');
				$("#blog-cover-img").attr("src",url);
				bbobj.after_cover_process();
			}).fail(function(jqxhr,t){
				if(t==='timeout')
					bbobj.loadCover();
			})
		},
		after_cover_process:function(){
			this.loadcommentcount();
			this.loadimages();
			this.newsletter();
			xmascvg.loaded++;
			if(xmascvg.loaded===2){

				setTimeout(function(){
					$("#loadposter").removeClass("opaque").addClass("transparent");
					setTimeout(function(){
						$("#loadposter").remove();
					},1000);
				},1000);
			}
			$script(["https://cdnjs.cloudflare.com/ajax/libs/fitvids/1.1.0/jquery.fitvids.min.js"],function(){
				$(".post-content").fitVids();
			})
		},
		newsletter:function(undefined){
			if(velma.newsletter!==undefined){
				if(velma.newsletter.hide===undefined||velma.newsletter.hide===false){
					if(velma.newsletter.popup!==undefined&&velma.newsletter.popup!==false){
					$("#mce-EMAIL").attr("placeholder","Email Address");
					if(sessionStorage.getItem("popped")!=="yes")
						$script(["https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"],function(){
							$(".modal-body").html($("#mc_embed_signup").html());
							setTimeout(function(){
								$("#myModal").modal();
								sessionStorage.setItem("popped","yes");
							},velma.newsletter.time===undefined?20000:velma.newsletter.time*1000);
					})
					}
				}
				else $("#mc_embed_signup").remove();
			}
		},
		loadimages:function(){
			$("[data-bg]").each(function(){
				var $thi = $(this),adr=$thi.data('bg');
				$el=$("<div>").addClass("progbar").appendTo($thi);
				function asyncload($this,url,pbar){
					$.ajax({
							url : url,
							cache: true,
							processData : false,
							timeout:60000,
							xhrFields:{
							 onprogress: function(progress){
								 if(progress.lengthComputable){
										 var percentage = Math.floor((progress.loaded / progress.total) * 100);
										 pbar.animate({'width': percentage+'%'},100);
									}
							 }
						 }
					}).success(function(){
							pbar.remove();
							$this.css("background-image",'url('+url+')').fadeIn();
					}).fail(function(jqxhr,t){
						if(t==='timeout')
							asyncload($this,url,pbar);
					})
				}
				asyncload($thi,adr,$el);
			})
		},
		loadcommentcount:function(undefined){
			if(velma.comment.disqus!==undefined&&typeof velma.comment.disqus === 'string'){
				disqus_shortname=velma.comment.disqus;
					var disqus_identifier = 'ghost-{{id}}';
					$script(['//' + velma.comment.disqus + '.disqus.com/count.js'],function(){});
					$(".disqus-comment-count").show();
			}
			if(velma.comment.facebook!==undefined&&velma.comment.facebook==='enabled'){
					$script(["//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.5"],function(){});
					$(".fb-comment-count").show();
			}
		},
		configure_share:function(){
			$("html").find(".openpinterestdialog").each(function(index,ele){
					$(this).attr("href","http://pinterest.com/pin/create/button/?url="+encodeURIComponent($(this).attr("href"))+"&media="+encodeURIComponent($(this).data("ihref")));
			});
			$("html").find(".opentumblrdialog").each(function(index,ele){
					$(this).attr("href","http://www.tumblr.com/share/link?url="+encodeURIComponent($(this).attr("href"))+"&name="+$(this).data("title")+"&description="+$(this).data("desc"));
			});
		},
		openDialog:function(ev){
			var $this=$(ev.currentTarget);
			window.open($this.attr("href"), $this.attr("title"),'width=500,height=300');
			return false;
		}
	});
	var listView = new ListView();
});
