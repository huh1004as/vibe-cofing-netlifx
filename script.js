// API 설정
const API_KEY = '37520b4f8c3d5d118dfcd2a8234e1f7d';
const API_URL = 'https://api.themoviedb.org/3/movie/now_playing';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// DOM 요소
const moviesContainer = document.getElementById('moviesContainer');

// 영화 데이터 가져오기
async function fetchMovies() {
    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}&language=ko-KR&page=1`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류 발생:', error);
        throw error;
    }
}

// 날짜 포맷팅 함수
function formatDate(dateString) {
    if (!dateString) return '개봉일 정보 없음';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}년 ${month}월 ${day}일`;
}

// 영화 카드 생성
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const posterUrl = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : null;
    
    const poster = posterUrl 
        ? `<img src="${posterUrl}" alt="${movie.title}" class="movie-poster" loading="lazy">`
        : `<div class="movie-poster-placeholder">포스터 없음</div>`;
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const releaseDate = formatDate(movie.release_date);
    const overview = movie.overview || '줄거리 정보가 없습니다.';
    
    card.innerHTML = `
        ${poster}
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-rating">⭐ ${rating}</div>
            <div class="movie-release-date">📅 ${releaseDate}</div>
            <p class="movie-overview">${overview}</p>
        </div>
    `;
    
    return card;
}

// 영화 목록 표시
async function displayMovies() {
    moviesContainer.innerHTML = '<div class="loading">영화를 불러오는 중...</div>';
    
    try {
        const movies = await fetchMovies();
        
        if (!movies || movies.length === 0) {
            moviesContainer.innerHTML = '<div class="error">표시할 영화가 없습니다.</div>';
            return;
        }
        
        moviesContainer.innerHTML = '';
        
        movies.forEach(movie => {
            const card = createMovieCard(movie);
            moviesContainer.appendChild(card);
        });
        
    } catch (error) {
        moviesContainer.innerHTML = `
            <div class="error">
                영화를 불러오는 중 오류가 발생했습니다.<br>
                ${error.message}
            </div>
        `;
    }
}

// 페이지 로드 시 영화 표시
document.addEventListener('DOMContentLoaded', displayMovies);

// 스크롤 시 헤더 배경 변경
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.querySelector('.header');
    
    if (currentScroll > 50) {
        header.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    } else {
        header.style.backgroundColor = 'transparent';
    }
    
    lastScroll = currentScroll;
});

