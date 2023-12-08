export const Roles = {
  ADMIN: "admin",
  GUEST: "guest",
  USER: "user",
};

export const CountryCodeDefault = {
  GB: "GB",
};

export const initialFilter = {
  pageSize: 10,
  pageIndex: 0,
};

export const STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECT: "reject",
};

export const EMAIL_REGEX = /^([a-zA-Z0-9])+(([a-zA-Z0-9_.-])*)+([a-zA-Z0-9])@(([a-zA-Z0-9-])+([a-zA-Z0-9])+\.)([a-zA-Z]{2,})((\.+([a-zA-Z]{2,}))*)$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}$/;
export const PHONE_REGEX = /^(0|84|\+84|084)\d{9}$/;
export const LINK_REGEX = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;

export const defautlPassword = "2Qlive2023@";
export const MAX_VIDEO_UPLOAD = 1024 * 1024 * 200;

export const TINY_API_KEY = "d58i95js5t0cfdehsggyi1tx1ojb0akpuiblhzscw8g2akgl";
export const ROOT_API = process.env.REACT_APP_API_HOST;
export const API_ROUTES = {
  LIST_TRACKING: '/api/v1/list-tracking',
  UPADTE_STATUS: '/api/v1/domain/update-status',
  DOMAIN_API: '/api/v1/domain',
  DELETE_DOMAIN: '/api/v1/domain/delete',
  EDIT_DOMAIN: '/api/v1/domain/update',
  SUBDOMAIN_API: '/api/v1/subdomain',
  DELETE_SUBDOMAIN:'/api/v1/subDomain/delete',
  USER_API:'/api/v1/user/users',
  LOGIN_API:'/api/v1/user/loginUser',
  LIVE_MATCHES: "/api/v1/match/live-matches-bo",
  CALENDAR_MATCHES: "/api/v1/match/calendar-matches",
  LEAGUES: "/api/v1/league/leagues-bo",
  CREATE_TOP_LEAGUES: "/api/v1/league/create-store",
  UPDATE_LEAGUES: "/api/v1/league/update-status",
  DELETE_LEAGUES: "/api/v1/league/delete",
  CREATE_LEAGUE: "/api/v1/league/leagues",
  COUNTRIES: "/api/v1/countryCode/all-countries",
  LEAGUES_BY_COUNTRY: "/api/v1/leagues",
  LIVE_MATCHES_MONTHLY: "/api/v1/live-matches-monthly",
  MEMBERS_MONTHLY: "/api/v1/members-monthly",
  VIEWERS_MONTHLY: "/api/v1/viewers-monthly",
  LEAGUES_FILTER: "/api/v1/league/leagues",
  UPDATE_LINK_LIVE: "/api/v1/match/update-link-live",
  REMOVE_LINK_LIVE: "/api/v1/match/remove-live-match",
  OPEN_LINK_LIVE: "/api/v1/match/set-open",
  MINI_LEAGUE: "/api/v1/league/leagues-mini",
  CREATE_MINI_LEAGUE: "/api/v1/league/create",
  UPDATE_MINI_LEAGUE: "/api/v1/league/update",
  CREATE_MATCH_MANUAL: "/api/v1/match/create",
  UPDATE_MATCH_MANUAL: "/api/v1/match/update",
  UPDATE_SCORE: "/api/v1/match/update-score",
  DELETE_MATCH: "/api/v1/match/delete",
  SEASONS: "/api/v1/seasons",
  CREATE_SEASON: "/api/v1/seasons/create",
  UPDATE_SEASON: "/api/v1/seasons/update",
  DELETE_SEASON: "/api/v1/seasons/delete",
  SEASON_OF_LEAGUE: "/api/v1/league-seasons",
  GROUPS: "/api/v1/groups",
  CREATE_GROUP: "/api/v1/groups/create",
  UPDATE_GROUP: "/api/v1/groups/update",
  DELETE_GROUP: "/api/v1/groups/delete",
  GROUP_OF_SEASON: "/api/v1/season-groups",
  TEAMS: "/api/v1/teams",
  TEAM_OF_GROUP: "/api/v1/group-teams",
  TEAM_OF_SEASON: "/api/v1/season-teams",
  TEAM_OF_SEASON_FOR_MATCH: "/api/v1/teams-for-match",
  ADD_TEAM_INTO_SEASON: "/api/v1/seasons/add-team",
  ADD_TEAM_INTO_GROUP: "/api/v1/groups/add-team",
  UPDATE_TEAM: "/api/v1/teams/update",
  CREATE_TEAM: "/api/v1/teams/create",
  DELETE_TEAM: "/api/v1/teams/delete",
  SEASON_ROUND: "/api/v1/season-rounds",
  CREATE_MINI_MATCH: "/api/v1/match/create-mini-match",
  UPDATE_MINI_MATCH: "/api/v1/match/update-mini-match",
  MATCHES_ROUND_SEASON: "/api/v1/match/rounds-matches",
  POSTS: "/api/v1/posts-2q",
  CREATE_POST: "/api/v1/posts-2q/create",
  UPDATE_POST: "/api/v1/posts-2q/update",
  DELETE_POST: "/api/v1/posts-2q/delete",
  PUBLIC_POST: "/api/v1/posts-2q/change-show",
  UPLOAD_IMAGE: "/api/v1/posts-2q/upload-image",
  UPLOAD_VIDEO: "/api/v1/posts-2q/upload-video",
  UPDATE_RANK: "/api/v1/ranks/update-rank",
  UPDATE_STATUS_SEASON: "/api/v1/seasons/update-status",
  UPDATE_TEAM_RESULT: "/api/v1/ranks/update-rank-fail",
  UPLOAD_THUMBNAIL: "/api/v1/contents/upload-thumbnail",
  UPDATE_STATUS_MATCH: "/api/v1/match/update-status",
};

export const FileImageValid = ["png", "jpeg", "jpg"];

export const ValidateMessage = {
  required: "The field is not empty",
  minNumber: "Must be greater than or equal to 1",
  mustNumber: "The field must be a number",
};

export const ModalType = {
  Add: "add",
  Delete: "delete",
  ChangeStatus: "changeStatus",
  EmailBackup: "emailBackup",
  Import: "import",
  Preview: "preview",
  Detail: "detail",
  ResetPassword: "resetPassword",
  UpdateRank: "updateRank",
};

export const SeasonTypeKey = {
  Cup: "CUP",
  League: "LEAGUE",
};

export const SeasonTypeOption = [
  {
    label: "Cup",
    value: SeasonTypeKey.Cup,
  },
  {
    label: "League",
    value: SeasonTypeKey.League,
  },
];

export const SeasonStatus = {
  OnGoing: "ON_GOING",
  UpComing: "UP_COMING",
  End: "END",
};

export const SeasonStatusText = {
  [SeasonStatus.OnGoing]: "On Going",
  [SeasonStatus.UpComing]: "Up coming",
  [SeasonStatus.End]: "End",
};

export const SeasonStatusOption = [
  {
    label: SeasonStatusText[SeasonStatus.UpComing],
    value: SeasonStatus.UpComing,
  },
  {
    label: SeasonStatusText[SeasonStatus.OnGoing],
    value: SeasonStatus.OnGoing,
  },
  {
    label: SeasonStatusText[SeasonStatus.End],
    value: SeasonStatus.End,
  },
];

export const MATCH_STATUS = 
{
  NS: "Not Started",
  FT: "Match Finished",
  CANC: "Match Cancelled",
  LIVE: "In Progress",
};

export const PostType = {
  Highlight: "HIGHLIGHT",
  News: "NEWS",
  Discuss: "DISCUSS",
};

export const PostTypeOption = [
  {
    label: "Highlight",
    value: PostType.Highlight,
  },
  {
    label: "News",
    value: PostType.News,
  },
  {
    label: "Discuss",
    value: PostType.Discuss,
  },
];

export const KnockoutOption = [
  {
    label: "2",
    value: "2",
  },
  {
    label: "4",
    value: "4",
  },
  {
    label: "8",
    value: "8",
  },
  {
    label: "16",
    value: "16",
  },
];

export const MatchResultStatus = {
  WIN: "WIN",
  DRAW: "DRAW",
  LOSE: "LOSE",
};

export const Points = {
  [MatchResultStatus.WIN]: 3,
  [MatchResultStatus.DRAW]: 1,
  [MatchResultStatus.LOSE]: 0,
};

export const MatchResultOption = [
  {
    label: "Win",
    value: MatchResultStatus.WIN,
  },
  {
    label: "Draw",
    value: MatchResultStatus.DRAW,
  },
  {
    label: "Lose",
    value: MatchResultStatus.LOSE,
  },
];

export const RoundResults = [
  {
    label: "Playing",
    value: "PLAYING",
  },
  {
    label: "Eliminated",
    value: "ELIMINATED",
  },
];
