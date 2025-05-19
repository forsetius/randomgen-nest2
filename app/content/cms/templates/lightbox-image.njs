<a href="/media/{{ src }}" data-toggle="lightbox" {% if title %} data-caption="{{ title }}" {% endif%} data-type="image" {% if gallery %} data-gallery="{{ gallery }}" {% endif %}>
  <img src="/media/{{ src }}" class="img-fluid" {% if title %} alt="{{ title }}" {% endif%} />
</a>