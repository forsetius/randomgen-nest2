<section class="cards">
  <div class="row row-cols-1 row-cols-md-2 g-4">
    {% for item in pages %}
    <div class="col">
      <div class="card text-bg-dark h-100 ">
        <a href="/page/{{ item.slug }}" class="stretched-link">
            <img src="/static/media/{{ item.thumbnailImage }}" class="card-img" alt="...">
            <div class="card-img-overlay">
              <h2 class="card-title position-absolute bottom-0">{{ item.title }}</h2>
            </div>
        </a>
      </div>
    </div>
    {% endfor %}
  </div>
</section>