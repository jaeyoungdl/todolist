"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        console.log('🔍 사용자 검증 시작:', { email, passwordLength: password.length });
        const user = await this.usersService.findByEmail(email);
        console.log('🔍 DB에서 찾은 사용자:', user ? { id: user.id, email: user.email, hasPassword: !!user.password, passwordLength: user.password?.length } : 'null');
        if (user) {
            console.log('🔍 비밀번호 비교 시작...');
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('🔍 비밀번호 비교 결과:', isPasswordValid);
            if (isPasswordValid) {
                const { password, ...result } = user;
                console.log('✅ 로그인 성공:', { id: result.id, email: result.email });
                return result;
            }
            else {
                console.log('❌ 비밀번호 불일치');
            }
        }
        else {
            console.log('❌ 사용자를 찾을 수 없음');
        }
        return null;
    }
    async register(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });
        const payload = { email: user.email, sub: user.id };
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        const payload = { email: user.email, sub: user.id };
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
            access_token: this.jwtService.sign(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map