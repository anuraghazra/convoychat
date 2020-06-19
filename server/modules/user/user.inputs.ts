import {
  IsHexColor,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { isColorTooDark } from '../../utils'
import { Validate } from "class-validator";
import { ArgsType, Field } from "type-graphql";

@ValidatorConstraint({ name: "validateColor", async: false })
class ValidateColor implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return !isColorTooDark(text);
  }

  defaultMessage(args: ValidationArguments) {
    return "Color value ($value) is too dark";
  }
}

@ArgsType()
export class setColorArgs {
  @Field({ nullable: false })
  @IsHexColor()
  @Validate(ValidateColor)
  color: string;
}