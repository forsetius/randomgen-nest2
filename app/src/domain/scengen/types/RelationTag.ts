export enum RelationTag {
  ADVERSARY = 'adversary',
  ALLY = 'ally',
  OWNED_BY = 'owned_by',
  OWNS = 'owns',
  PRESENCE = 'presence',
  PRESENT_IN = 'present_in',
  PROVIDED_BY = 'provided_by',
  PROVIDES = 'provides',
  REQUIRES = 'requires',
  RISK = 'risk',
  STAKEHOLDER = 'stakeholder',
}

export const Relations: Record<RelationTag, RelationTag | null> = {
  [RelationTag.ADVERSARY]: null,
  [RelationTag.ALLY]: null,
  [RelationTag.OWNED_BY]: RelationTag.OWNS,
  [RelationTag.OWNS]: RelationTag.OWNED_BY,
  [RelationTag.PRESENCE]: RelationTag.PRESENT_IN,
  [RelationTag.PRESENT_IN]: RelationTag.PRESENCE,
  [RelationTag.PROVIDED_BY]: RelationTag.PROVIDES,
  [RelationTag.PROVIDES]: RelationTag.PROVIDED_BY,
  [RelationTag.REQUIRES]: null,
  [RelationTag.RISK]: null,
  [RelationTag.STAKEHOLDER]: RelationTag.STAKEHOLDER,
};
