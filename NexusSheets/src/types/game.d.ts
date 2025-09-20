export type ListField = {
  type: "list";
  default: string[];
};

export type ObjectField = {
  type: "object";
  fields: string[];
  default: Record<string, any>;
};

export type CharacterSchema = {
  [key: string]: string[] | ListField | ObjectField;
};

export type GameDefinition = {
  id: string;
  name: string;
  characterSchema: CharacterSchema;
  campaignSchema: {
    sections: string[];
  };
};

export type UITab = {
  id: string;
  label: string;
  fields: string | string[];
};

export type UIDefinition = {
  tabs: UITab[];
};
