import { Matches } from 'class-validator';

export class TagParamDto {
  @Matches(/^[\p{L}\d\s-]+$/u)
  tag!: string;
}
