<div class="grid grid-cols-2 gap-8 mx-auto max-w-7xl min-h-[30rem] w-full px-4 pt-7 pb-16">
{% for section in section %}
    <div class="cols-span-{{ section.span }} flex flex-col gap-6 lg:col-span-1">
        <div class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ section.title }}
        </div>
        {% if section.text %}
        <div class="text-l text-gray-900 dark:text-gray-100">
            {{ section.text }}
        </div>
        {% endif %}
        {% for item in items %}
        <div class="grid grid-cols-12 gap-x-6">
            <div class="col-span-6">
                <a
                    href="{{ item.url }}"
                    class="group flex gap-4 p-4 bg-gray-100 rounded outline-none lg:p-3 lg:bg-transparent hover:bg-gray-50 focus:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-900 dark:focus:bg-gray-900"
                >
                    <div class="flex-1 flex flex-col gap-1">
                        <div class="mt-0.5 text-base font-medium leading-none text-gray-700 dark:text-gray-100">
                            {{ item.title }}</div>
                        <div class="font-light text-sm text-gray-500 dark:text-gray-400">{{ item.text }}</div>
                    </div>
                </a>
            </div>
        </div>
        {% endfor %}
    </div>
{% endfor %}
    <div class="cols-span-2 flex flex-col gap-6 lg:col-span-1 border-l pl-6">
        <div class="text-xl font-bold text-gray-900 dark:text-gray-100">Cykle</div>
        <div class="grid grid-cols-12 gap-x-6">
            <div aria-label="Link do tekstów z kategorii Sobota prawdę Ci powie" class="col-span-6">
                <a
                    href="/kategoria/sobota-prawde-ci-powie"
                    class="group flex gap-4 p-4 bg-gray-100 rounded outline-none lg:p-3 lg:bg-transparent hover:bg-gray-50 focus:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-900 dark:focus:bg-gray-900"
                >
                    <div class="flex-1 flex flex-col gap-1">
                        <div class="mt-0.5 text-base font-medium leading-none text-gray-700 dark:text-gray-100">Sobota prawdę Ci powie</div>
                        <div class="font-light text-sm text-gray-500 dark:text-gray-400">Sprawdzamy prawdziwość wypowiedzi osób publicznych, rozbrajamy mity i popularne złudzenia, piszemy o błędach poznawczych.</div>
                    </div>
                </a>
            </div>
        </div>
    </div>
</div>