export namespace IShowsApi {
  export interface Root {
    data: Data;
  }

  export interface Data {
    infraz?: Infraz;
    tmdb: Tmdb;
    warez?: Warez;
  }

  export interface Infraz {
    seasons: Season[];
    info: Info;
    episodes: Episodes;
  }

  export interface Season {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    season_number: number;
    cover: string;
    cover_big: string;
  }

  export interface Info {
    name: string;
    cover: string;
    plot: string;
    cast: string;
    director: string;
    genre: string;
    releaseDate: string;
    last_modified: string;
    rating: string;
    rating_5based: number;
    backdrop_path: string[];
    youtube_trailer: string;
    episode_run_time: string;
    category_id: string;
  }

  export type Episodes = Record<string, Episode[]>;

  export interface Episode {
    id: string;
    episode_num: number;
    title: string;
    container_extension: string;
    info: EpisodeInfo;
    custom_sid: string;
    added: string;
    season: number;
    direct_source: string;
  }

  export interface EpisodeInfo {
    tmdb_id: number;
    releasedate: string;
    plot: string;
    duration_secs: number;
    duration: string;
    movie_image: string;
    video: any[];
    audio: any[];
    bitrate: number;
    rating: number;
    season: string;
  }

  export interface Tmdb {
    adult: boolean;
    backdrop_path: string;
    created_by: CreatedBy[];
    episode_run_time: number[];
    first_air_date: string;
    genres: Genre[];
    homepage: string;
    id: number;
    in_production: boolean;
    languages: string[];
    last_air_date: string;
    last_episode_to_air: LastEpisodeToAir;
    name: string;
    next_episode_to_air: any;
    networks: Network[];
    number_of_episodes: number;
    number_of_seasons: number;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    seasons: Season2[];
    spoken_languages: SpokenLanguage[];
    status: string;
    tagline: string;
    type: string;
    vote_average: number;
    vote_count: number;
    videos: Videos;
    images: Images;
    credits: Credits;
    keywords: Keywords;
    _images: Images2;
    media_type: string;
  }

  export interface CreatedBy {
    id: number;
    credit_id: string;
    name: string;
    gender: number;
    profile_path: string;
  }

  export interface Genre {
    id: number;
    name: string;
  }

  export interface LastEpisodeToAir {
    id: number;
    name: string;
    overview: string;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
  }

  export interface Network {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }

  export interface ProductionCompany {
    id: number;
    logo_path?: string;
    name: string;
    origin_country: string;
  }

  export interface ProductionCountry {
    iso_3166_1: string;
    name: string;
  }

  export interface Season2 {
    air_date: string;
    episode_count: number;
    id: number;
    name: string;
    overview: string;
    poster_path: string;
    season_number: number;
  }

  export interface SpokenLanguage {
    english_name: string;
    iso_639_1: string;
    name: string;
  }

  export interface Videos {
    results: any[];
  }

  export interface Images {
    backdrops: any[];
    logos: any[];
    posters: any[];
  }

  export interface Credits {
    cast: Cast[];
    crew: any[];
  }

  export interface Cast {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
    character: string;
    credit_id: string;
    order: number;
  }

  export interface Keywords {
    results: Result[];
  }

  export interface Result {
    name: string;
    id: number;
  }

  export interface Images2 {
    covers: string[];
    posters: string[];
    logos: string[];
  }

  export interface Warez {
    id: string;
    sources: any[];
    seasons: Season3[];
  }

  export interface Season3 {
    id: number;
    season: number;
    videos: Video[];
  }

  export interface Video {
    id: string;
    img: string;
    name: string;
    sources: Source[];
  }

  export interface Source {
    lang: string;
    url: string;
    subtitleUrl?: string;
    subtitleLang?: string;
  }
}

export namespace IShowsEpisodeApi {
  export interface Root {
    data: Data;
  }

  export interface Data {
    tmdb: Tmdb;
    warez: Warez;
    infraz: Infraz;
  }

  export interface Tmdb {
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    production_code: string;
    runtime: number;
    season_number: number;
    show_id: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
    crew: Crew[];
    guest_stars: GuestStar[];
  }

  export interface Crew {
    job: string;
    department: string;
    credit_id: string;
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string;
  }

  export interface GuestStar {
    character: string;
    credit_id: string;
    order: number;
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path?: string;
  }

  export interface Warez {
    id: string;
    img: string;
    name: string;
    sources: Source[];
  }

  export interface Source {
    lang: string;
    url: string;
    subtitleUrl?: string;
    subtitleLang?: string;
  }

  export interface Infraz {
    id: string;
    episode_num: number;
    title: string;
    container_extension: string;
    info: Info;
    custom_sid: string;
    added: string;
    season: number;
    direct_source: string;
  }

  export interface Info {
    tmdb_id: number;
    releasedate: string;
    plot: string;
    duration_secs: number;
    duration: string;
    movie_image: string;
    video: any[];
    audio: any[];
    bitrate: number;
    rating: number;
    season: string;
  }
}
