import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./prisma.js";
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "./config.js";

// Solo si se trabaja con sesiones
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   done(null, id);
// });

// ------ Strategies ------ //

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log("profile desde el passport", profile);
      // console.log("accessToken desde el passport", accessToken);
      // console.log("refreshToken desde el passport", refreshToken);

      (async () => {
        try {
          const user = await prisma.users.upsert({
            where: { providerId: profile.id },
            update: {
              firstname: profile.name.givenName,
              lastname: profile.name.familyName,
              email: profile.emails[0].value,
              profileUrl: profile.photos[0].value,
              username: `${profile.name.givenName}.${profile.name.familyName}`,
            },
            create: {
              providerId: profile.id,
              provider: "GOOGLE",
              firstname: profile.name.givenName,
              lastname: profile.name.familyName,
              email: profile.emails[0].value,
              profileUrl: profile.photos[0].value,
              username: `${profile.name.givenName}.${profile.name.familyName}`,
            },
          });
          delete user.password;

          done(null, user);
        } catch (err) {
          done(err, null);
        }
      })();
    }
  )
);

export default passport;
