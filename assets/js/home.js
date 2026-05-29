// // BANNER (O seu código original)
let banners = document.querySelectorAll('.banner-area a');
let counters = document.querySelectorAll('.banner-counter-item');
let currentBanner = 0;
let bannerInterval;

counters.forEach((item, key) => {
    item.addEventListener('click', () => {
        currentBanner = key;
        showBanner(key);
        restartBannerTimer();
    });
});

restartBannerTimer();

function showBanner(n) {
    for (let banner of banners) {
        banner.classList.remove('active');
    }
    for (let counter of counters) {
        counter.classList.remove('active');
    }
    banners[n].classList.add('active');
    counters[n].classList.add('active');
}

function restartBannerTimer() {
    clearInterval(bannerInterval);
    bannerInterval = setInterval(nextBanner, 2000);
}

function nextBanner() {
    if (currentBanner + 1 >= banners.length) {
        currentBanner = 0;
    } else {
        currentBanner++;
    }
    showBanner(currentBanner);
}

// =========================================================
// 🚀 CÓDIGO DO SUPABASE (Adicionado aqui no final)
// =========================================================
async function carregarProdutosHome() {
    console.log("Iniciando conexão com o Supabase...");

    // Busca os produtos marcados como 'mais vistos'
    const { data: produtos, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_most_viewed', true);

    if (error) {
        console.error("Erro ao puxar dados do Supabase:", error);
        return;
    }

    // Mapeia o container do Grid de produtos dentro do HTML do Tailwind
    const container = document.querySelector('.product-list .grid');
    
    if (!container) {
        console.warn("Container de produtos não foi encontrado no HTML.");
        return;
    }

    // Limpa os cards antigos
    container.innerHTML = ""; 

    if (produtos.length === 0) {
        container.innerHTML = "<p class='col-span-full text-gray-400 text-sm text-center py-8'>Nenhum produto cadastrado no momento.</p>";
        return;
    }

    // Insere cada produto dinamicamente
    produtos.forEach(prod => {
        container.innerHTML += `
            <div class="group relative bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                <a href="product.html?id=${prod.id}" class="space-y-3 block">
                    <div class="aspect-square bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center p-4">
                        <img src="${prod.image_url}" alt="${prod.name}" class="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" />
                    </div>
                    <div>
                        <div class="font-medium text-sm text-gray-700">${prod.name}</div>
                        <div class="font-bold text-lg text-black mt-1">R$ ${Number(prod.price_to).toFixed(2).replace('.', ',')}</div>
                        <div class="text-xs font-medium text-emerald-600 mt-0.5">Pagamento via PIX</div>
                    </div>
                </a>
                <button class="absolute top-6 right-6 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition border border-gray-100">
                    <img src="assets/images/ui/heart-3-line.png" alt="Favoritar" class="w-5 h-5" />
                </button>
            </div>
        `;
    });
}

// Executa a busca assim que a página carrega
document.addEventListener("DOMContentLoaded", carregarProdutosHome);
