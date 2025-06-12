export type GetFollowedStreams = {
    data: GetFollowedStreamsData[];
    pagination: {
        cursor?: string;
    };
};

export type GetFollowedStreamsData = {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: 'live';
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
    thumbnail_url: string;
    tags: string[];
    is_mature: boolean;
};

export type GetVideos = {
    id: string;
    stream_id: string | null;
    user_id: string;
    user_login: string;
    user_name: string;
    title: string;
    description: string;
    created_at: string;
    published_at: string;
    url: string;
    thumbnail_url: string;
    viewable: 'public';
    view_count: number;
    language: string;
    type: 'archive' | 'highlight' | 'upload';
    duration: string;
    muted_segments:
        | null
        | {
              duration: number;
              offset: number;
          }[];
};

export type GetChannelInformation = {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    broadcaster_language: string;
    game_name: string;
    game_id: string;
    title: string;
    delay: number;
    tags: string[];
    content_classification_labels: string[];
    is_branded_content: boolean;
};

export type GetUsers = {
    id: string;
    login: string;
    display_name: string;
    type: 'admin' | 'global_mod' | 'staff' | '';
    broadcaster_type: 'affiliate' | 'partner' | '';
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    created_at: string;
};

export type GetUserChatColor = {
    user_id: string;
    user_login: string;
    user_name: string;
    color: string;
};
