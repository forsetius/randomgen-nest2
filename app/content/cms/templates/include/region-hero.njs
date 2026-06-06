<section class="hero hero-{{ "with-lead" if lead else "no-lead" }}" aria-labelledby="article-title">
    <div class="container-fluid position-relative z-1">
        <div class="row g-5">
            <div class="col-lg-5 pt-5 pb-lg-4 d-flex flex-column">
                <span class="hero__category d-inline-flex mb-3 text-uppercase fw-bold">
                    {{ categoryData.current.breadcrumbs if categoryData else "&nbsp;" }}
                </span>
                
                <h1 id="article-title" class="hero__title fw-bold mb-4">
                    <span id="main-title" class="display-1 me-auto">{{ title }}</span>
                    {% if subtitle %}<br /><span id="subtitle" class="display-2">{{ subtitle }}</span>{% endif %}
                </h1>
                
                <div id="heroMeta"
                     class="hero__meta d-flex flex-wrap align-items-center gap-3 mb-4"
                >
                    {% if date %}
                    <span class="d-inline-flex align-items-center gap-2">
                        <svg viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
                          <path d="M7 2h2v3h6V2h2v3h3v16H4V5h3V2Zm11 8H6v9h12v-9ZM6 8h12V7H6v1Z" fill="currentColor"/>
                        </svg>
                        <time datetime="{{ date }}">{{ date }}</time>
                    </span>
                    <span aria-hidden="true" class="hero__separator"></span>
                    {% endif %}
                </div>
                
                {% if lead %}
                <div id="lead" class="hero__lead mt-auto mb-0">{{ lead }}</div>
                {% endif %}
            </div>
            
            <div class="col-lg-7 py-lg-4">
                <figure class="hero__figure mb-0">
                    <img id="hero-image" class="img-fluid" src="/media/{{ headerImage }}" loading="eager">
                </figure>
            </div>
        </div>
    </div>
</section>
