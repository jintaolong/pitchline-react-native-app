export enum MatchEventType {
  Goal = "Goal",
  Card = "Card",
  Substitution = "subst",
  Penalty = "Penalty",
  Offside = "Offside",
  VAR = "Var",
}

export enum MatchEventDetail {
  YellowCard = "Yellow Card",
  RedCard = "Red Card",
  Substitution = "Substitution",
  Penalty = "Penalty",
  Offside = "Offside",
  VAR = "VAR",
}

export enum MatchStatType {
    BallPossession = "ball possession",
    ShotsInsideBox = "shots insidebox",
    ShotsOutsideBox = "shots outsidebox",
    Fouls = "fouls",
    CornerKicks = "corner kicks",
    Offsides = "offsides",
    YellowCards = "yellow cards",
    RedCards = "red cards",
    GoalkeeperSaves = "goalkeeper saves",
    TotalPasses = "total passes",
    PassesAccurate = "passes accurate",
    PassesPercentage = "passes %",
    ExpectedGoals = "expected_goals",
    GoalsPrevented = "goals_prevented",
    ShotsOnGoal = "shots on goal",
    ShotsOffGoal = "shots off goal",
    TotalShots = "total shots"
}